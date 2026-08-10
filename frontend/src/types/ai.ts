export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AiResultMessage {
  sessionId: string;
  type: "COMPLEXITY" | "CHAT";
  content: string | null;
  error: string | null;
}
