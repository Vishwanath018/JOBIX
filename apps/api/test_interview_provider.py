import asyncio
from dotenv import load_dotenv

load_dotenv("D:/Jobix/apps/api/.env")

from app.services.interview_provider_manager import InterviewProviderManager


async def test():
    manager = InterviewProviderManager()

    result = await manager.generate(
        messages=[
            {
                "role": "system",
                "content": "You are a technical interviewer. Ask concise interview questions."
            },
            {
                "role": "user",
                "content": "I am preparing for a DSA interview. Ask me one simple array interview question."
            }
        ]
    )

    print("Provider:", result.provider)
    print("Model:", result.model)
    print("Response:", result.content)


asyncio.run(test())
