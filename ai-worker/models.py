from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class AiRequestType(str, Enum):
    COMPLEXITY = "COMPLEXITY"
    CHAT = "CHAT"


class ChatTurn(BaseModel):
    role: str
    content: str


class AiRequestMessage(BaseModel):
    session_id: str = Field(alias="sessionId")
    type: AiRequestType
    language: Optional[str] = None
    source_code: Optional[str] = Field(default=None, alias="sourceCode")
    message: Optional[str] = None
    history: Optional[List[ChatTurn]] = None
    problem_id: Optional[int] = Field(default=None, alias="problemId")
    problem_title: Optional[str] = Field(default=None, alias="problemTitle")
    problem_description: Optional[str] = Field(default=None, alias="problemDescription")

    class Config:
        populate_by_name = True


class AiResultMessage(BaseModel):
    session_id: str = Field(alias="sessionId")
    type: AiRequestType
    content: Optional[str] = None
    error: Optional[str] = None

    class Config:
        populate_by_name = True