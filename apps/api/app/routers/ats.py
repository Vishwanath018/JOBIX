from app.core.security import get_current_user
import json
import re
from typing import Any

import jwt
import requests
from docx import Document
from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from pydantic import BaseModel, Field
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/ats", tags=["ATS"])

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_RESUME_TEXT = 30000
MAX_JOB_DESCRIPTION = 12000

ALLOWED_EXTENSIONS = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
}


class AtsItem(BaseModel):
    title: str
    description: str
    priority: str = Field(pattern="^(high|medium|low)$")


class AtsImprovement(BaseModel):
    area: str
    issue: str
    recommendation: str
    priority: str = Field(pattern="^(high|medium|low)$")


class AtsResult(BaseModel):
    ats_score: int = Field(ge=0, le=100)
    score_label: str
    summary: str
    strengths: list[AtsItem]
    missing_fields: list[AtsItem]
    improvements: list[AtsImprovement]
    keyword_gaps: list[str]
    formatting_issues: list[str]
    action_plan: list[str]



async def read_upload(file: UploadFile) -> tuple[str, str]:
    filename = file.filename or ""
    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported resume format. Please upload PDF, DOCX, or TXT.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(status_code=400, detail="The uploaded resume is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume exceeds the 10 MB upload limit.",
        )

    try:
        if extension == ".pdf":
            from io import BytesIO

            reader = PdfReader(BytesIO(content))
            text_parts = []

            for page in reader.pages:
                text_parts.append(page.extract_text() or "")

            text = "\n".join(text_parts)

        elif extension == ".docx":
            from io import BytesIO

            document = Document(BytesIO(content))
            paragraphs = [paragraph.text for paragraph in document.paragraphs]

            for table in document.tables:
                for row in table.rows:
                    paragraphs.append(" | ".join(cell.text for cell in row.cells))

            text = "\n".join(paragraphs)

        else:
            text = content.decode("utf-8", errors="ignore")

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded resume. Please upload a valid file.",
        )

    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()

    if len(text) < 120:
        raise HTTPException(
            status_code=400,
            detail="We could not extract enough readable text from this resume. Please upload a text-based PDF or DOCX resume.",
        )

    return text[:MAX_RESUME_TEXT], extension


def clean_json_response(content: str) -> dict[str, Any]:
    content = content.strip()

    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", content, re.DOTALL)

        if not match:
            raise HTTPException(
                status_code=502,
                detail="Sarvam returned an invalid ATS analysis response.",
            )

        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=502,
                detail="Sarvam returned an unreadable ATS analysis response.",
            )


def analyze_with_sarvam(resume_text: str, job_description: str) -> AtsResult:
    if not settings.sarvam_api_key:
        raise HTTPException(
            status_code=503,
            detail="Sarvam AI is not configured on the JOBIX backend.",
        )

    schema = {
        "type": "object",
        "properties": {
            "ats_score": {
                "type": "integer",
                "description": "Overall ATS compatibility score from 0 to 100.",
            },
            "score_label": {
                "type": "string",
                "description": "One of Strong, Good, Moderate, or Needs Improvement.",
            },
            "summary": {
                "type": "string",
                "description": "Short professional explanation of the resume ATS performance.",
            },
            "strengths": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                        },
                    },
                    "required": ["title", "description", "priority"],
                    "additionalProperties": False,
                },
            },
            "missing_fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                        },
                    },
                    "required": ["title", "description", "priority"],
                    "additionalProperties": False,
                },
            },
            "improvements": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "area": {"type": "string"},
                        "issue": {"type": "string"},
                        "recommendation": {"type": "string"},
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                        },
                    },
                    "required": ["area", "issue", "recommendation", "priority"],
                    "additionalProperties": False,
                },
            },
            "keyword_gaps": {
                "type": "array",
                "items": {"type": "string"},
            },
            "formatting_issues": {
                "type": "array",
                "items": {"type": "string"},
            },
            "action_plan": {
                "type": "array",
                "items": {"type": "string"},
            },
        },
        "required": [
            "ats_score",
            "score_label",
            "summary",
            "strengths",
            "missing_fields",
            "improvements",
            "keyword_gaps",
            "formatting_issues",
            "action_plan",
        ],
        "additionalProperties": False,
    }

    job_context = (
        job_description.strip()
        if job_description.strip()
        else "No specific job description was provided. Evaluate the resume against general modern ATS and recruiter expectations."
    )

    prompt = f"""
You are JOBIX ATS Engine.

Analyze the candidate resume as a professional Applicant Tracking System and resume evaluator.

Your job is to identify:
1. ATS compatibility
2. Resume strengths
3. Missing resume fields
4. Weak or unclear content
5. Keyword gaps
6. Formatting problems that can hurt ATS parsing
7. Concrete improvements
8. A prioritized action plan

Do not invent candidate experience, education, certifications, companies, achievements, skills, dates, or metrics.

Only identify something as missing when it is genuinely absent or insufficiently represented in the supplied resume.

Score the resume from 0 to 100 using:
- Contact and identity information
- Professional summary
- Skills
- Experience
- Education
- Projects where relevant
- Certifications where relevant
- Quantified achievements
- Keyword relevance
- ATS readability
- Formatting
- Job-description alignment when a job description is supplied

The score must reflect the actual resume, not an idealized resume.

Job description:
{job_context}

Resume:
{resume_text}
"""

    url = f"{settings.sarvam_base_url.rstrip('/')}/v1/chat/completions"

    payload = {
        "model": settings.sarvam_resume_model or "sarvam-105b",
        "messages": [
            {
                "role": "system",
                "content": "Return only the requested JSON object. Do not add markdown or explanations outside the JSON.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 0.2,
        "max_tokens": 5000,
        "reasoning_effort": None,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "jobix_ats_result",
                "strict": True,
                "schema": schema,
            },
        },
    }

    try:
        response = requests.post(
            url,
            headers={
                "api-subscription-key": settings.sarvam_api_key,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=settings.resume_request_timeout_seconds,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="JOBIX could not reach the Sarvam AI service.",
        )

    if response.status_code == 403:
        raise HTTPException(
            status_code=502,
            detail="Sarvam AI rejected the configured API key.",
        )

    if response.status_code == 429:
        raise HTTPException(
            status_code=503,
            detail="Sarvam AI rate limit or quota was reached. Please try again shortly.",
        )

    if response.status_code >= 500:
        raise HTTPException(
            status_code=502,
            detail="Sarvam AI is temporarily unavailable.",
        )

    if not response.ok:
        try:
            error_data = response.json()
            error_message = (
                error_data.get("error", {}).get("message")
                or error_data.get("message")
                or "Sarvam AI request failed."
            )
        except Exception:
            error_message = "Sarvam AI request failed."

        raise HTTPException(status_code=502, detail=error_message)

    try:
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Sarvam returned an unexpected ATS response.",
        )

    result_data = clean_json_response(content)

    try:
        return AtsResult.model_validate(result_data)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Sarvam returned ATS data that failed JOBIX validation.",
        )


@router.post("/check", response_model=AtsResult)
async def check_resume(
    resume: UploadFile = File(...),
    job_description: str = "",
    current_user: User = Depends(get_current_user),
):
    if len(job_description) > MAX_JOB_DESCRIPTION:
        raise HTTPException(
            status_code=400,
            detail="Job description is too long.",
        )

    resume_text, _ = await read_upload(resume)

    result = analyze_with_sarvam(
        resume_text=resume_text,
        job_description=job_description,
    )

    return result

