import httpx

from config import settings

COMPLEXITY_SYSTEM_PROMPT = (
    "You are a precise algorithms tutor. Given source code, respond with a short "
    "time and space complexity analysis, formatted as:\n"
    "Time Complexity: O(...)\n"
    "Space Complexity: O(...)\n"
    "Explanation: 2-4 sentences justifying both, referencing the actual loops, "
    "recursion, or data structures in the code. Do not restate the code. Do not "
    "comment on correctness or bugs unless asked."
)

CHAT_SYSTEM_PROMPT_TEMPLATE = (
    "You are a helpful, concise coding-problem assistant embedded in a competitive "
    "programming platform. Give hints and guidance without giving away full "
    "solutions unless explicitly asked. Keep answers short; use markdown code "
    "blocks for code.\n\n{context}"
)


def _build_chat_context(
    title: str | None,
    description: str | None,
    source_code: str | None,
    language: str | None,
) -> str:
    parts = []
    if title or description:
        parts.append(
            f"The user is working on this problem:\nTitle: {title or 'Unknown'}\n{description or ''}".strip()
        )
    if source_code:
        parts.append(f"The user's current code ({language or 'unknown language'}):\n```\n{source_code}\n```")
    if not parts:
        return ""
    return "\n\n".join(parts) + "\n\nUse this context directly — don't ask the user to repeat it."


class GroqClient:
    def __init__(self) -> None:
        self._client = httpx.AsyncClient(timeout=settings.request_timeout_s)

    async def close(self) -> None:
        await self._client.aclose()

    async def analyze_complexity(self, source_code: str, language: str | None) -> str:
        prompt = f"Language: {language or 'unknown'}\n\nCode:\n```\n{source_code}\n```"
        return await self._complete(COMPLEXITY_SYSTEM_PROMPT, [{"role": "user", "content": prompt}])

    async def chat(
        self,
        message: str,
        history: list[dict] | None,
        problem_title: str | None = None,
        problem_description: str | None = None,
        source_code: str | None = None,
        language: str | None = None,
    ) -> str:
        context = _build_chat_context(problem_title, problem_description, source_code, language)
        system_prompt = CHAT_SYSTEM_PROMPT_TEMPLATE.format(context=context)
        messages = [*(history or []), {"role": "user", "content": message}]
        return await self._complete(system_prompt, messages)

    async def _complete(self, system_prompt: str, messages: list[dict]) -> str:
        payload = {
            "model": settings.groq_model,
            "messages": [{"role": "system", "content": system_prompt}, *messages],
            "temperature": 0.2,
        }
        headers = {
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        }
        resp = await self._client.post(settings.groq_api_url, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


groq_client = GroqClient()