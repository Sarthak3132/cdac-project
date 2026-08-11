import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { RootState } from "@/app/store";
import { api } from "@/services/axios-interceptor";
import { socket } from "@/app/websocket-provider";
import type { AiResultMessage, ChatTurn } from "@/types/ai";
import type { ProblemDetails } from "@/types/problem-detail";

const AI_TIMEOUT_MS = 30000;

export function AiPanel({ problem }: { problem: ProblemDetails }) {
  const { selectedLanguage, codeByProblem } = useSelector(
    (state: RootState) => state.problemEditor,
  );
  const code = codeByProblem[problem.id]?.[selectedLanguage] ?? "";
  const [chatSessionId] = useState(() => uuidv4());

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const [complexityResult, setComplexityResult] = useState<string | null>(null);
  const [complexityError, setComplexityError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleAnalyzeComplexity = async () => {
    if (!code.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setComplexityResult(null);
    setComplexityError(null);

    try {
      const response = await api.post("/ai/complexity", {
        sourceCode: code,
        language: selectedLanguage,
        problemId: problem.id,
      });
      const sessionId: string = response.data.data.sessionId;

      const timeout = setTimeout(() => {
        setComplexityError("Timed out waiting for the analysis. Please try again.");
        setIsAnalyzing(false);
        subscription.unsubscribe();
      }, AI_TIMEOUT_MS);

      const subscription = socket.subscribe(`/topic/ai-complexity-result/${sessionId}`, (msg) => {
        const result: AiResultMessage = JSON.parse(msg.body);
        clearTimeout(timeout);
        setIsAnalyzing(false);
        result.error ? setComplexityError(result.error) : setComplexityResult(result.content);
        subscription.unsubscribe();
      });
    } catch (err) {
      console.error(err);
      setComplexityError("Failed to submit code for analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isChatting) return;

    const historyBeforeThisTurn = messages;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsChatting(true);

    try {
      const response = await api.post("/ai/chat", {
        sessionId: chatSessionId,
        message: trimmed,
        history: historyBeforeThisTurn,
        problemTitle: problem.title,
        problemDescription: problem.description,
        sourceCode: code,
        language: selectedLanguage,
      });
      const sessionId: string = response.data.data.sessionId;

      const timeout = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Timed out waiting for a response. Please try again." },
        ]);
        setIsChatting(false);
        subscription.unsubscribe();
      }, AI_TIMEOUT_MS);

      const subscription = socket.subscribe(`/topic/ai-chat-result/${sessionId}`, (msg) => {
        const result: AiResultMessage = JSON.parse(msg.body);
        clearTimeout(timeout);
        setIsChatting(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.error ?? result.content ?? "" },
        ]);
        subscription.unsubscribe();
      });
    } catch (err) {
      console.error(err);
      setIsChatting(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to send message." }]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-border space-y-2 border-b p-3">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={handleAnalyzeComplexity}
          disabled={isAnalyzing || !code.trim()}
        >
          {isAnalyzing ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          )}
          {isAnalyzing ? "Analyzing..." : "Analyze Time & Space Complexity"}
        </Button>

        {complexityError && <p className="text-xs text-red-500">{complexityError}</p>}
        {complexityResult && (
          <pre className="bg-muted/30 rounded-md p-2 text-xs leading-relaxed whitespace-pre-wrap">
            {complexityResult}
          </pre>
        )}
      </div>

      <Separator />

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="space-y-3 p-3">
          {messages.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-xs">
              <Bot className="h-5 w-5" />
              Ask for a hint about this problem.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg p-2 text-sm ${m.role === "user" ? "bg-primary/10 ml-6" : "bg-muted/50 mr-6"}`}
            >
              {m.content}
            </div>
          ))}
          {isChatting && (
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-border flex items-end gap-2 border-t p-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask for a hint..."
          className="h-9 min-h-9 resize-none text-sm"
        />
        <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={isChatting}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
