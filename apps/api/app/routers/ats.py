from typing import Any
import json
import re
from io import BytesIO

import requests
from docx import Document
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, Field
from pypdf import PdfReader

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ats", tags=["ATS"])

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_RESUME_TEXT = 14000
MAX_JOB_DESCRIPTION = 6000


class AtsItem(BaseModel):
    title: str
    explanation: str


class AtsImprovement(BaseModel):
    title: str
    explanation: str
    priority: str


class AtsResult(BaseModel):
    ats_score: int = Field(ge=0, le=100)
    score_label: str
    role_match_score: int = Field(ge=0, le=100)
    role: str
    summary: str
    strengths: list[AtsItem]
    missing_fields: list[AtsItem]
    improvements: list[AtsImprovement]
    keyword_gaps: list[str]
    matched_keywords: list[str]
    formatting_issues: list[str]
    action_plan: list[str]


def extract_pdf(file: UploadFile) -> str:
    try:
        reader = PdfReader(file.file)
        parts = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                parts.append(text)
        return "\n".join(parts)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the PDF: {exc}",
        )


def extract_docx(file: UploadFile) -> str:
    try:
        document = Document(file.file)
        parts = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        for table in document.tables:
            for row in table.rows:
                parts.append(
                    " | ".join(cell.text for cell in row.cells)
                )

        return "\n".join(parts)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the DOCX: {exc}",
        )


def extract_txt(file: UploadFile) -> str:
    try:
        return file.file.read().decode(
            "utf-8",
            errors="ignore",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the text file: {exc}",
        )


def extract_resume_text(file: UploadFile) -> str:
    filename = (file.filename or "").lower()

    if filename.endswith(".pdf"):
        text = extract_pdf(file)
    elif filename.endswith(".docx"):
        text = extract_docx(file)
    elif filename.endswith(".txt"):
        text = extract_txt(file)
    else:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, and TXT resumes are supported.",
        )

    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()

    if len(text) < 120:
        raise HTTPException(
            status_code=400,
            detail="The uploaded resume does not contain enough readable text.",
        )

    return text[:MAX_RESUME_TEXT]


def build_schema() -> dict[str, Any]:
    item_schema = {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "explanation": {"type": "string"},
        },
        "required": [
            "title",
            "explanation",
        ],
        "additionalProperties": False,
    }

    improvement_schema = {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "explanation": {"type": "string"},
            "priority": {"type": "string"},
        },
        "required": [
            "title",
            "explanation",
            "priority",
        ],
        "additionalProperties": False,
    }

    return {
        "type": "object",
        "properties": {
            "ats_score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
            },
            "score_label": {"type": "string"},
            "role_match_score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
            },
            "role": {"type": "string"},
            "summary": {"type": "string"},
            "strengths": {
                "type": "array",
                "items": item_schema,
            },
            "missing_fields": {
                "type": "array",
                "items": item_schema,
            },
            "improvements": {
                "type": "array",
                "items": improvement_schema,
            },
            "keyword_gaps": {
                "type": "array",
                "items": {"type": "string"},
            },
            "matched_keywords": {
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
            "role_match_score",
            "role",
            "summary",
            "strengths",
            "missing_fields",
            "improvements",
            "keyword_gaps",
            "matched_keywords",
            "formatting_issues",
            "action_plan",
        ],
        "additionalProperties": False,
    }


def build_prompt(
    resume_text: str,
    job_role: str,
    job_description: str,
) -> str:
    role = job_role.strip() or "Infer the best target role from the resume."
    jd = job_description.strip() or "No job description supplied. Evaluate against the target role."

    return f"""
You are JOBIX ATS.

Analyze this resume for the target role.

TARGET ROLE:
{role}

JOB DESCRIPTION:
{jd}

RESUME:
{resume_text}

Return a realistic ATS dashboard analysis.

Evaluate:
- ATS readability
- role match
- job description match
- skills
- experience
- projects
- education
- certifications
- achievements
- keywords
- missing information
- formatting
- recruiter readability

STRICT OUTPUT LIMITS:
- strengths: maximum 5
- missing_fields: maximum 4
- improvements: maximum 6
- keyword_gaps: maximum 6
- matched_keywords: maximum 18
- formatting_issues: maximum 5
- action_plan: maximum 6
- Every explanation must be 20 words or fewer.
- Every action_plan item must be 18 words or fewer.
- Every keyword must be short.
- Keep summary under 45 words.

IMPORTANT:
- Use only information actually present in the resume.
- Never invent experience, skills, employers, certifications, metrics or technologies.
- matched_keywords must exist in the resume.
- keyword_gaps must be relevant to the selected role or supplied job description.
- missing_fields must identify genuinely missing or weak information.
- strengths must contain evidence from the resume.
- improvements must be practical.
- Scores must be realistic.
- Return every required field.
- Empty arrays are allowed.
- Return ONLY valid JSON.
""".strip()

def parse_content(content: Any) -> str:
    if content is None:
        return ""

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, dict):
        if isinstance(content.get("text"), str):
            return content["text"].strip()
        return json.dumps(content)

    if isinstance(content, list):
        parts = []

        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)

        return "".join(parts).strip()

    return str(content).strip()


def parse_json_text(text: str) -> dict[str, Any]:
    cleaned = text.strip()

    if not cleaned:
        raise ValueError("Empty response.")

    if cleaned.startswith("```"):
        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        )

    try:
        value = json.loads(cleaned)

        if isinstance(value, dict):
            return value
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start >= 0 and end > start:
        value = json.loads(
            cleaned[start:end + 1]
        )

        if isinstance(value, dict):
            return value

    raise ValueError(
        "Sarvam did not return a valid JSON object."
    )


def normalize_result(
    data: dict[str, Any],
    job_role: str,
) -> AtsResult:

    def string(
        value: Any,
        fallback: str = "",
    ) -> str:
        if value is None:
            return fallback
        return str(value).strip()

    def integer(
        value: Any,
        fallback: int = 0,
    ) -> int:
        try:
            return max(
                0,
                min(
                    100,
                    int(float(value)),
                ),
            )
        except (TypeError, ValueError):
            return fallback

    def string_list(
        value: Any,
    ) -> list[str]:
        if not isinstance(value, list):
            return []

        result = []

        for item in value:
            if isinstance(item, str):
                item = item.strip()
                if item:
                    result.append(item)

        return result

    def item_list(
        value: Any,
    ) -> list[AtsItem]:

        if not isinstance(value, list):
            return []

        result = []

        for item in value:

            if isinstance(item, dict):

                title = string(
                    item.get("title")
                    or item.get("name")
                    or item.get("issue")
                    or item.get("field")
                )

                explanation = string(
                    item.get("explanation")
                    or item.get("reason")
                    or item.get("description")
                    or item.get("details")
                )

                if title:
                    result.append(
                        AtsItem(
                            title=title,
                            explanation=explanation,
                        )
                    )

            elif isinstance(item, str):

                item = item.strip()

                if item:
                    result.append(
                        AtsItem(
                            title=item,
                            explanation="",
                        )
                    )

        return result

    def improvement_list(
        value: Any,
    ) -> list[AtsImprovement]:

        if not isinstance(value, list):
            return []

        result = []

        for item in value:

            if isinstance(item, dict):

                title = string(
                    item.get("title")
                    or item.get("name")
                    or item.get("action")
                )

                explanation = string(
                    item.get("explanation")
                    or item.get("reason")
                    or item.get("description")
                    or item.get("details")
                )

                priority = string(
                    item.get("priority"),
                    "Medium",
                )

                if title:
                    result.append(
                        AtsImprovement(
                            title=title,
                            explanation=explanation,
                            priority=priority,
                        )
                    )

            elif isinstance(item, str):

                item = item.strip()

                if item:
                    result.append(
                        AtsImprovement(
                            title=item,
                            explanation="",
                            priority="Medium",
                        )
                    )

        return result

    score = integer(
        data.get("ats_score"),
        0,
    )

    role_match = integer(
        data.get("role_match_score"),
        0,
    )

    role = string(
        data.get("role"),
        job_role.strip() or "Target Role",
    )

    score_label = string(
        data.get("score_label"),
    )

    if not score_label:
        if score >= 85:
            score_label = "Excellent"
        elif score >= 70:
            score_label = "Good"
        elif score >= 50:
            score_label = "Needs Improvement"
        else:
            score_label = "Weak"

    return AtsResult(
        ats_score=score,
        score_label=score_label,
        role_match_score=role_match,
        role=role,
        summary=string(
            data.get("summary"),
            "ATS analysis completed.",
        ),
        strengths=item_list(
            data.get("strengths"),
        ),
        missing_fields=item_list(
            data.get("missing_fields"),
        ),
        improvements=improvement_list(
            data.get("improvements"),
        ),
        keyword_gaps=string_list(
            data.get("keyword_gaps"),
        ),
        matched_keywords=string_list(
            data.get("matched_keywords"),
        ),
        formatting_issues=string_list(
            data.get("formatting_issues"),
        ),
        action_plan=string_list(
            data.get("action_plan"),
        ),
    )


def call_sarvam(
    resume_text: str,
    job_role: str,
    job_description: str,
    response_format: dict[str, Any],
) -> tuple[str, dict[str, Any]]:

    if not settings.sarvam_api_key:
        raise HTTPException(
            status_code=500,
            detail="SARVAM_API_KEY is not configured.",
        )

    payload = {
        "model": settings.sarvam_resume_model or "sarvam-105b",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are JOBIX's professional ATS engine. "
                    "Return only valid structured JSON."
                ),
            },
            {
                "role": "user",
                "content": build_prompt(
                    resume_text,
                    job_role,
                    job_description,
                ),
            },
        ],
        "temperature": 0.1,
        "reasoning_effort": None,
        "max_tokens": 3000,
        "response_format": response_format,
    }

    try:
        response = requests.post(
            "https://api.sarvam.ai/v1/chat/completions",
            headers={
                "api-subscription-key": settings.sarvam_api_key,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=75,
        )
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not reach Sarvam: {exc}",
        )

    try:
        body = response.json()
    except ValueError:
        body = {}

    if response.status_code >= 400:

        error = (
            body.get("error", {})
            if isinstance(body, dict)
            else {}
        )

        message = (
            error.get("message")
            if isinstance(error, dict)
            else None
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Sarvam request failed: "
                f"{message or response.text[:500]}"
            ),
        )

    choices = (
        body.get("choices")
        if isinstance(body, dict)
        else None
    )

    if not isinstance(choices, list) or not choices:
        raise HTTPException(
            status_code=502,
            detail="Sarvam returned no choices for the ATS request.",
        )

    choice = (
        choices[0]
        if isinstance(choices[0], dict)
        else {}
    )

    message = (
        choice.get("message")
        if isinstance(choice.get("message"), dict)
        else {}
    )

    content = parse_content(
        message.get("content")
    )

    metadata = {
        "finish_reason": choice.get("finish_reason"),
        "model": body.get("model"),
        "usage": body.get("usage"),
    }

    return content, metadata


def analyze_with_sarvam(
    resume_text: str,
    job_role: str,
    job_description: str,
) -> AtsResult:

    schema_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "jobix_ats_result",
            "strict": True,
            "schema": build_schema(),
        },
    }

    content, metadata = call_sarvam(
        resume_text,
        job_role,
        job_description,
        schema_format,
    )

    if not content:

        fallback_format = {
            "type": "json_object",
        }

        content, metadata = call_sarvam(
            resume_text,
            job_role,
            job_description,
            fallback_format,
        )

    if not content:

        raise HTTPException(
            status_code=502,
            detail=(
                "Sarvam returned an empty ATS response. "
                f"finish_reason="
                f"{metadata.get('finish_reason') or 'unknown'}."
            ),
        )

    try:
        data = parse_json_text(content)

        return normalize_result(
            data,
            job_role,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=(
                "Sarvam returned an ATS response "
                f"that JOBIX could not parse: {exc}"
            ),
        )


@router.post(
    "/check",
    response_model=AtsResult,
)
async def check_resume(
    resume: UploadFile = File(...),
    job_role: str = Form(""),
    job_description: str = Form(""),
    current_user: User = Depends(get_current_user),
):

    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a resume.",
        )

    file_data = await resume.read()

    if not file_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded resume is empty.",
        )

    if len(file_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Resume file must be 10 MB or smaller.",
        )

    resume.file = BytesIO(file_data)

    resume_text = extract_resume_text(
        resume,
    )

    jd = job_description.strip()[:MAX_JOB_DESCRIPTION]

    return analyze_with_sarvam(
        resume_text,
        job_role.strip(),
        jd,
    )
