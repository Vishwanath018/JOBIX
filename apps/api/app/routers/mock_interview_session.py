
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.mock_interview import MockInterviewSession
from app.services.interview_provider_manager import InterviewProviderManager


router = APIRouter(
    prefix="/api/mock-interview",
    tags=["mock-interview"],
)

FREE_SECONDS = 210

MOCK_INTERVIEW_UNLIMITED_EMAILS = {
    "nirgunrk5@gmail.com",
}

ALLOWED_SUBJECTS = {
    "dsa": "Data Structures and Algorithms",
    "sql": "SQL and Databases",
    "dbms": "Database Management Systems",
    "oops": "Object-Oriented Programming",
    "networks": "Computer Networks",
    "os": "Operating Systems",
    "mixed": "Mixed Technical Interview",
}


class StartRequest(BaseModel):
    subject: str
    difficulty: str = "medium"
    candidate_name: str = "Vishwanath"
    candidate_skills: str = ""
    current_focus: str = ""
    question_title: str | None = None
    question_statement: str | None = None


class StartResponse(BaseModel):
    session_id: UUID
    interviewer: str
    remaining_seconds: int
    provider: str
    model: str


class GenerateRequest(BaseModel):
    session_id: UUID
    answer: str = ""
    message: str | None = None
    stage: str = "followup"
    history: list[dict] = []
    question_title: str | None = None
    question_statement: str | None = None


class GenerateResponse(BaseModel):
    interviewer: str
    remaining_seconds: int
    provider: str
    model: str


class FinishRequest(BaseModel):
    session_id: UUID


class FinishResponse(BaseModel):
    status: str
    duration_seconds: int


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def remaining_seconds(session: MockInterviewSession) -> int:
    seconds = int((session.expires_at - now_utc()).total_seconds())
    return max(0, seconds)


def require_active_session(
    session_id: UUID,
    current_user,
    db: Session,
) -> MockInterviewSession:

    session = db.scalar(
        select(MockInterviewSession).where(
            MockInterviewSession.id == session_id,
            MockInterviewSession.user_id == current_user.id,
        )
    )

    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    if session.status != "active":
        raise HTTPException(status_code=409, detail="Interview session is already completed")

    if now_utc() >= session.expires_at:
        session.status = "expired"
        session.ended_at = now_utc()
        db.commit()

        raise HTTPException(
            status_code=410,
            detail="Interview time has expired",
        )

    return session


def build_system_prompt(
    subject: str,
    difficulty: str,
    candidate_name: str,
    stage: str,
    question_title: str | None,
    question_statement: str | None,
) -> str:

    topic = ALLOWED_SUBJECTS.get(subject, subject)

    question_context = ""

    if question_title and question_statement:
        question_context = f"""
THE REAL JOBIX QUESTION IS:

Title:
{question_title}

Statement:
{question_statement}

You MUST use this exact question.
Do not invent another problem.
Do not replace it with a similar problem.
"""

    return f"""
You are the live technical interviewer for JOBIX.

Candidate name: {candidate_name}
Interview subject: {topic}
Difficulty: {difficulty}

This is a real-time spoken technical interview.

RULES:
- Ask only ONE question at a time.
- Keep responses concise and natural for speech.
- Never dump multiple questions together.
- Do not give the solution unless the candidate explicitly asks.
- Adapt follow-up questions to the candidate's previous answer.
- Ask for reasoning before implementation.
- Ask about complexity when appropriate.
- Ask about edge cases when appropriate.
- Do not fabricate candidate information.
- Do not fabricate a DSA problem.
- When a real JOBIX question is supplied, use that exact question.

CURRENT INTERVIEW STAGE:
{stage}

{question_context}
"""


@router.post("/start", response_model=StartResponse)
async def start_interview(
    payload: StartRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    subject = payload.subject.lower().strip()

    if subject not in ALLOWED_SUBJECTS:
        raise HTTPException(status_code=400, detail="Invalid interview subject")

    email = str(getattr(current_user, "email", "")).strip().lower()

    unlimited = email in MOCK_INTERVIEW_UNLIMITED_EMAILS

    existing = db.scalar(
        select(MockInterviewSession).where(
            MockInterviewSession.user_id == current_user.id,
            MockInterviewSession.status == "active",
        )
    )

    if existing and not unlimited:
        raise HTTPException(
            status_code=409,
            detail="You already have an active mock interview",
        )

    started = now_utc()
    expires = (
        started + timedelta(days=36500)
        if unlimited
        else started + timedelta(seconds=FREE_SECONDS)
    )

    session = MockInterviewSession(
        user_id=current_user.id,
        subject=subject,
        difficulty=payload.difficulty.lower().strip(),
        status="active",
        started_at=started,
        expires_at=expires,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    manager = InterviewProviderManager()

    prompt = build_system_prompt(
        subject=subject,
        difficulty=payload.difficulty,
        candidate_name=payload.candidate_name,
        stage="introduction",
        question_title=payload.question_title,
        question_statement=payload.question_statement,
    )

    result = await manager.generate(
        [
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": f"""
Start the interview naturally.

Introduce yourself as the JOBIX interviewer.
Welcome {payload.candidate_name}.
Then ask the candidate to introduce themselves with:
1. Name
2. Key technical skills
3. What they are currently focusing on

Do not ask a DSA question yet.
""",
            },
        ]
    )

    return StartResponse(
        session_id=session.id,
        interviewer=result.content,
        remaining_seconds=remaining_seconds(session),
        provider=result.provider,
        model=result.model,
    )


@router.post("/generate", response_model=GenerateResponse)
async def generate_response(
    payload: GenerateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = require_active_session(
        payload.session_id,
        current_user,
        db,
    )

    email = str(getattr(current_user, "email", "")).strip().lower()
    unlimited = email in MOCK_INTERVIEW_UNLIMITED_EMAILS
    session._is_unlimited = unlimited

    # IMPORTANT:
    # Check expiration BEFORE calling any external provider.
    if not unlimited and remaining_seconds(session) <= 0:
        session.status = "expired"
        session.ended_at = now_utc()
        db.commit()

        raise HTTPException(
            status_code=410,
            detail="Interview time has expired",
        )

    prompt = build_system_prompt(
        subject=session.subject,
        difficulty=session.difficulty,
        candidate_name="Vishwanath",
        stage=payload.stage,
        question_title=payload.question_title,
        question_statement=payload.question_statement,
    )

    messages = [
        {
            "role": "system",
            "content": prompt,
        }
    ]

    for item in payload.history[-12:]:
        role = item.get("role")

        if role not in {"user", "assistant"}:
            continue

        content = str(item.get("content", "")).strip()

        if content:
            messages.append(
                {
                    "role": role,
                    "content": content,
                }
            )

    candidate_answer = (
        payload.answer.strip()
        or (payload.message or "").strip()
    )

    if not candidate_answer:
        for item in reversed(payload.history):
            if item.get("role") in {"user", "candidate"}:
                candidate_answer = str(item.get("content", "")).strip()
                if candidate_answer:
                    break

    if not candidate_answer:
        raise HTTPException(
            status_code=400,
            detail="Candidate answer is required",
        )

    messages.append(
        {
            "role": "user",
            "content": candidate_answer,
        }
    )

    # Re-check immediately before provider call.
    if not unlimited and remaining_seconds(session) <= 0:
        session.status = "expired"
        session.ended_at = now_utc()
        db.commit()

        raise HTTPException(
            status_code=410,
            detail="Interview time has expired",
        )

    manager = InterviewProviderManager()

    result = await manager.generate(messages)

    # Provider may have taken long enough for the session to expire.
    if not unlimited and remaining_seconds(session) <= 0:
        session.status = "expired"
        session.ended_at = now_utc()
        db.commit()

        raise HTTPException(
            status_code=410,
            detail="Interview time has expired",
        )

    return GenerateResponse(
        interviewer=result.content,
        remaining_seconds=remaining_seconds(session),
        provider=result.provider,
        model=result.model,
    )


@router.post("/finish", response_model=FinishResponse)
async def finish_interview(
    payload: FinishRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.scalar(
        select(MockInterviewSession).where(
            MockInterviewSession.id == payload.session_id,
            MockInterviewSession.user_id == current_user.id,
        )
    )

    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    if session.status == "active":
        session.status = "completed"
        session.ended_at = now_utc()
        db.commit()

    end = session.ended_at or now_utc()

    duration = int(
        max(
            0,
            (end - session.started_at).total_seconds(),
        )
    )

    return FinishResponse(
        status=session.status,
        duration_seconds=duration,
    )
