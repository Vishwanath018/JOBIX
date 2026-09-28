
import asyncio
import os
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


router = APIRouter(prefix="/api/code", tags=["code"])

JUDGE0_URL = os.getenv("JUDGE0_URL", "https://ce.judge0.com").rstrip("/")
JUDGE0_AUTH_TOKEN = os.getenv("JUDGE0_AUTH_TOKEN", "").strip()

LANGUAGE_NAMES = {
    "java": ("Java (JDK 17.0.6)", "Java (OpenJDK 13.0.1)"),
    "python": ("Python (3.14.0)", "Python (3.13.2)", "Python (3.12.5)", "Python (3.11.2)", "Python (3.8.1)"),
    "cpp": ("C++ (GCC 14.1.0)", "C++ (GCC 9.2.0)", "C++ (GCC 8.3.0)", "C++ (GCC 7.4.0)", "C++ (Clang 7.0.1)"),
}


class RunRequest(BaseModel):
    language: str
    code: str
    input: str = ""
    expected_output: str | None = None
    cpu_time_limit: float = Field(default=2.0, ge=0.1, le=10.0)
    memory_limit: int = Field(default=128000, ge=16000, le=512000)


class RunResponse(BaseModel):
    status: str
    status_id: int | None = None
    stdout: str | None = None
    stderr: str | None = None
    compile_output: str | None = None
    message: str | None = None
    time: str | None = None
    memory: int | None = None
    accepted: bool
    verdict: str


def judge0_headers() -> dict[str, str]:
    headers = {
        "Content-Type": "application/json",
    }

    if JUDGE0_AUTH_TOKEN:
        headers["X-Auth-Token"] = JUDGE0_AUTH_TOKEN

    return headers


async def get_language_id(client: httpx.AsyncClient, language: str) -> int:
    normalized = language.lower().strip()

    if normalized not in LANGUAGE_NAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {language}",
        )

    response = await client.get(
        f"{JUDGE0_URL}/languages",
        headers=judge0_headers(),
        timeout=15,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve Judge0 languages.",
        )

    languages = response.json()

    wanted = {name.lower() for name in LANGUAGE_NAMES[normalized]}

    for item in languages:
        name = str(item.get("name", "")).lower()

        if name in wanted:
            return int(item["id"])

    raise HTTPException(
        status_code=502,
        detail=f"Judge0 does not expose a compatible {language} language.",
    )


async def create_submission(
    client: httpx.AsyncClient,
    payload: dict[str, Any],
) -> str:
    response = await client.post(
        f"{JUDGE0_URL}/submissions/",
        params={
            "base64_encoded": "false",
            "wait": "false",
        },
        headers=judge0_headers(),
        json=payload,
        timeout=20,
    )

    if response.status_code not in (200, 201):
        try:
            detail = response.json()
        except Exception:
            detail = response.text

        raise HTTPException(
            status_code=502,
            detail={
                "message": "Judge0 rejected the submission.",
                "judge0": detail,
            },
        )

    data = response.json()
    token = data.get("token")

    if not token:
        raise HTTPException(
            status_code=502,
            detail="Judge0 did not return a submission token.",
        )

    return token


async def get_submission(
    client: httpx.AsyncClient,
    token: str,
) -> dict[str, Any]:
    for _ in range(60):
        response = await client.get(
            f"{JUDGE0_URL}/submissions/{token}",
            params={
                "base64_encoded": "false",
            },
            headers=judge0_headers(),
            timeout=15,
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail="Unable to retrieve Judge0 submission result.",
            )

        result = response.json()
        status = result.get("status") or {}
        status_id = status.get("id")

        # 1 = In Queue, 2 = Processing.
        if status_id not in (1, 2):
            return result

        await asyncio.sleep(0.25)

    raise HTTPException(
        status_code=504,
        detail="Judge0 execution timed out while waiting for a result.",
    )


def normalize_output(value: str | None) -> str:
    if value is None:
        return ""

    lines = value.replace("\r\n", "\n").replace("\r", "\n").split("\n")

    while lines and not lines[-1].strip():
        lines.pop()

    return "\n".join(line.rstrip() for line in lines).strip()


def build_verdict(result: dict[str, Any]) -> tuple[str, bool]:
    status = result.get("status") or {}
    status_id = status.get("id")
    description = str(status.get("description") or "Unknown")

    if status_id == 3:
        return "Accepted", True

    if status_id == 4:
        return "Wrong Answer", False

    if status_id in (5, 6):
        return "Time Limit Exceeded", False

    if status_id in (7, 8, 9, 10, 11, 12, 13, 14):
        return description, False

    return description, False


@router.get("/health")
async def code_health():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{JUDGE0_URL}/languages",
                headers=judge0_headers(),
                timeout=10,
            )

            return {
                "status": "connected" if response.status_code == 200 else "unavailable",
                "judge0_url": JUDGE0_URL,
                "languages": len(response.json()) if response.status_code == 200 else 0,
            }
        except Exception as exc:
            return {
                "status": "unavailable",
                "judge0_url": JUDGE0_URL,
                "error": str(exc),
            }


@router.post("/run", response_model=RunResponse)
async def run_code(request: RunRequest):
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty.",
        )

    async with httpx.AsyncClient() as client:
        language_id = await get_language_id(client, request.language)

        payload = {
            "source_code": request.code,
            "language_id": language_id,
            "stdin": request.input,
            "cpu_time_limit": request.cpu_time_limit,
            "cpu_extra_time": 0.5,
            "wall_time_limit": min(request.cpu_time_limit * 3, 15),
            "memory_limit": request.memory_limit,
            "enable_network": False,
            "max_processes_and_or_threads": 20,
            "max_file_size": 1024,
        }

        if request.expected_output is not None:
            payload["expected_output"] = request.expected_output

        token = await create_submission(client, payload)
        result = await get_submission(client, token)

    verdict, accepted = build_verdict(result)
    status = result.get("status") or {}

    return RunResponse(
        status=str(status.get("description") or "Unknown"),
        status_id=status.get("id"),
        stdout=result.get("stdout"),
        stderr=result.get("stderr"),
        compile_output=result.get("compile_output"),
        message=result.get("message"),
        time=result.get("time"),
        memory=result.get("memory"),
        accepted=accepted,
        verdict=verdict,
    )
