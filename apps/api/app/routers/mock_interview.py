from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user
from app.schemas.mock_interview import (
    InterviewGenerateRequest,
    InterviewGenerateResponse,
)
from app.services.interview_provider_manager import provider_manager

router = APIRouter(
    prefix="/api/mock-interview",
    tags=["mock-interview"],
)


@router.post("/generate", response_model=InterviewGenerateResponse)
async def generate_interview_response(
    payload: InterviewGenerateRequest,
    current_user=Depends(get_current_user),
):
    system_message = {
        "role": "system",
        "content": (
            "You are the JOBIX technical interviewer. "
            f"The interview topic is {payload.subject}. "
            f"The difficulty is {payload.difficulty}. "
            "Ask one question at a time. "
            "Do not reveal the solution unless explicitly requested. "
            "Use concise spoken-language responses. "
            "Ask natural follow-up questions based on the candidate's answer. "
            "Keep the response suitable for a live technical interview."
        ),
    }

    messages = [
        system_message,
        *[
            {
                "role": message.role,
                "content": message.content,
            }
            for message in payload.messages
        ],
    ]

    try:
        result = await provider_manager.generate(messages)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Interview service temporarily unavailable.",
        ) from exc

    return InterviewGenerateResponse(
        provider=result.provider,
        model=result.model,
        content=result.content,
    )
