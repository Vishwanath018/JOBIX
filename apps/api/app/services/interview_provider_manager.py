import os
from pathlib import Path
import time
from dataclasses import dataclass
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=False)



def clean_interviewer_response(content: str) -> str:
    if not content:
        return ""

    text = str(content).strip()

    # Remove common provider safety/moderation metadata.
    unwanted_exact = {
        "User Safety: safe",
        "user safety: safe",
        "USER SAFETY: SAFE",
        "Safety: safe",
        "safety: safe",
    }

    lines = []

    for line in text.splitlines():
        cleaned = line.strip()

        if cleaned in unwanted_exact:
            continue

        # Remove metadata prefixes if the provider attaches them.
        lowered = cleaned.lower()

        if lowered.startswith("user safety:"):
            continue

        if lowered.startswith("safety classification:"):
            continue

        if lowered.startswith("moderation:"):
            continue

        if lowered.startswith("safety:") and (
            "safe" in lowered or "pass" in lowered
        ):
            continue

        lines.append(line)

    result = "\n".join(lines).strip()

    # Remove accidental repeated safety text anywhere in the response.
    for phrase in (
        "User Safety: safe",
        "user safety: safe",
        "USER SAFETY: SAFE",
    ):
        result = result.replace(phrase, "").strip()

    return result


@dataclass
class ProviderResult:
    provider: str
    model: str
    content: str


@dataclass
class ProviderState:
    name: str
    model: str
    api_key: str
    cooldown_until: float = 0.0


class InterviewProviderManager:
    def __init__(self):
        self.providers: list[ProviderState] = []
        self._load_openrouter_keys()
        self._load_gemini()
        self._load_groq()
        self._load_sarvam()

    def _load_openrouter_keys(self):
        # Every configured OpenRouter key uses the global model unless
        # an explicit per-key model is intentionally configured.
        global_model = os.getenv(
            "OPENROUTER_MODEL",
            "openrouter/free",
        ).strip() or "openrouter/free"

        for index in range(1, 51):
            key = os.getenv(f"OPENROUTER_API_KEY_{index}")
            if not key:
                continue

            model = (
                os.getenv(f"OPENROUTER_MODEL_{index}", "").strip()
                or global_model
            )

            self.providers.append(
                ProviderState(
                    name=f"openrouter-{index}",
                    model=model,
                    api_key=key.strip(),
                )
            )

    def _load_gemini(self):
        key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        if key:
            self.providers.append(
                ProviderState(
                    name="gemini",
                    model=model,
                    api_key=key,
                )
            )

    def _load_groq(self):
        key = os.getenv("GROQ_API_KEY")
        model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        if key:
            self.providers.append(
                ProviderState(
                    name="groq",
                    model=model,
                    api_key=key,
                )
            )

    def _load_sarvam(self):
        key = os.getenv("SARVAM_API_KEY")
        model = os.getenv("SARVAM_INTERVIEW_MODEL", "sarvam-105b")
        if key:
            self.providers.append(
                ProviderState(
                    name="sarvam",
                    model=model,
                    api_key=key,
                )
            )

    def _available(self, provider: ProviderState) -> bool:
        return time.time() >= provider.cooldown_until

    def _cooldown(self, provider: ProviderState, seconds: int = 60):
        provider.cooldown_until = time.time() + seconds

    async def _openrouter(
        self,
        provider: ProviderState,
        messages: list[dict],
    ) -> ProviderResult:
        response = await httpx.AsyncClient(timeout=25).post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {provider.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": os.getenv(
                    "JOBIX_APP_URL",
                    "http://localhost:3000",
                ),
                "X-Title": "JOBIX Mock Interview",
            },
            json={
                "model": provider.model,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 500,
            },
        )

        if response.status_code in {429, 500, 502, 503, 504}:
            raise RuntimeError(f"TEMPORARY:{response.status_code}")

        response.raise_for_status()
        data = response.json()

        choices = data.get("choices") or []
        if not choices:
            raise RuntimeError("TEMPORARY:empty_response")

        message = choices[0].get("message") or {}
        content = message.get("content")

        if isinstance(content, list):
            parts = []
            for part in content:
                if isinstance(part, dict) and part.get("text"):
                    parts.append(str(part["text"]))
                elif isinstance(part, str):
                    parts.append(part)
            content = "\n".join(parts)

        content = str(content or "").strip()

        if not content:
            raise RuntimeError("TEMPORARY:empty_response")
        if not content or not str(content).strip():
            raise RuntimeError("TEMPORARY:empty_response")

        return ProviderResult(
            provider=provider.name,
            model=provider.model,
            content=clean_interviewer_response(content),
        )

    async def _gemini(
        self,
        provider: ProviderState,
        messages: list[dict],
    ) -> ProviderResult:
        prompt = "\n\n".join(
            f"{item['role'].upper()}: {item['content']}"
            for item in messages
        )

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"models/{provider.model}:generateContent"
        )

        response = await httpx.AsyncClient(timeout=25).post(
            url,
            params={"key": provider.api_key},
            json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt,
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 500,
                },
            },
        )

        if response.status_code in {429, 500, 502, 503, 504}:
            raise RuntimeError(f"TEMPORARY:{response.status_code}")

        response.raise_for_status()
        data = response.json()
        content = data["candidates"][0]["content"]["parts"][0]["text"]

        return ProviderResult(
            provider=provider.name,
            model=provider.model,
            content=clean_interviewer_response(content),
        )

    async def _groq(
        self,
        provider: ProviderState,
        messages: list[dict],
    ) -> ProviderResult:
        response = await httpx.AsyncClient(timeout=25).post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {provider.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": provider.model,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 500,
            },
        )

        if response.status_code in {429, 500, 502, 503, 504}:
            raise RuntimeError(f"TEMPORARY:{response.status_code}")

        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        if not content or not str(content).strip():
            raise RuntimeError("TEMPORARY:empty_response")

        return ProviderResult(
            provider=provider.name,
            model=provider.model,
            content=clean_interviewer_response(content),
        )

    async def _sarvam(
        self,
        provider: ProviderState,
        messages: list[dict],
    ) -> ProviderResult:
        response = await httpx.AsyncClient(timeout=45).post(
            "https://api.sarvam.ai/v1/chat/completions",
            headers={
                "api-subscription-key": provider.api_key,
                "Content-Type": "application/json",
            },
            json={
                "model": provider.model,
                "messages": messages,
                "temperature": 0.2,
                "reasoning_effort": None,
                "max_tokens": 500,
            },
        )

        if response.status_code in {429, 500, 502, 503, 504}:
            raise RuntimeError(f"TEMPORARY:{response.status_code}")

        response.raise_for_status()

        data = response.json()
        choices = data.get("choices") or []

        if not choices:
            raise RuntimeError("TEMPORARY:empty_response")

        message = choices[0].get("message") or {}
        content = message.get("content")

        if not content:
            raise RuntimeError("TEMPORARY:empty_response")

        content = str(content).strip()

        if not content:
            raise RuntimeError("TEMPORARY:empty_response")

        return ProviderResult(
            provider=provider.name,
            model=provider.model,
            content=clean_interviewer_response(content),
        )

    async def generate(
        self,
        messages: list[dict],
    ) -> ProviderResult:
        errors = []

        for provider in self.providers:
            if not self._available(provider):
                continue

            try:
                if provider.name.startswith("openrouter-"):
                    return await self._openrouter(provider, messages)

                if provider.name == "gemini":
                    return await self._gemini(provider, messages)

                if provider.name == "groq":
                    return await self._groq(provider, messages)

                if provider.name == "sarvam":
                    return await self._sarvam(provider, messages)

            except Exception as exc:
                error_text = str(exc)
                safe_error = error_text.replace(provider.api_key, "[REDACTED]")
                errors.append(f"{provider.name}: {type(exc).__name__}: {safe_error}")

                if error_text.startswith("TEMPORARY:"):
                    self._cooldown(provider)

                continue

        raise RuntimeError(
            "No interview provider is currently available. "
            f"Provider diagnostics: {' | '.join(errors) or 'none configured'}"
        )


provider_manager = InterviewProviderManager()
