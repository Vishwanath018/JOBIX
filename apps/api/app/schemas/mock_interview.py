from pydantic import BaseModel, Field


class InterviewMessage(BaseModel):
    role: str
    content: str


class InterviewGenerateRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=50)
    difficulty: str = Field(min_length=1, max_length=20)
    messages: list[InterviewMessage] = Field(min_length=1, max_length=30)


class InterviewGenerateResponse(BaseModel):
    provider: str
    model: str
    content: str
