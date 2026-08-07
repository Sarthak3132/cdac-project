import { useDispatch, useSelector } from "react-redux";
import { Play, RefreshCw, Send } from "lucide-react";
import Editor from "@monaco-editor/react";

import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { RootState, AppDispatch } from "@/app/store";

import {
  setLanguage,
  setCode,
  resetCode,
} from "@/features/problem-detail/slice/ProblemEditorSlice";

import type { ProblemTemplate } from "@/types/problem-detail";
import { useState, useEffect } from "react";
import { OutputPanel } from "./output-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { api } from "@/services/axios-interceptor";
import { socket } from "@/app/websocket-provider";

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  inputData: string;
  actualOutput: string | null;
  expectedOutput: string;
  stderr: string | null;
  statusDescription: string;
  time: number | null;
  memory: number | null;
}

export interface ProblemExecutionResult {
  sessionId: string;
  overallStatus: string;
  passedCount: number;
  totalCount: number;
  // present only when the code failed to compile — no test cases ran at all
  compileError: string | null;
  // the FIRST test case that failed (LeetCode-style: we don't get a full list
  // anymore, just the one that broke it — or null if everything passed / it
  // was a compile error)
  failedTestCase: TestCaseResult | null;
}

const EXECUTION_TIMEOUT_MS = 20000;

export function EditorPanel({
  problemId,
  templates,
}: {
  problemId: number;
  templates: ProblemTemplate[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  const { selectedLanguage, codeByProblem } = useSelector(
    (state: RootState) => state.problemEditor,
  );

  const code = codeByProblem[problemId]?.[selectedLanguage] ?? "";

  const [mode, setMode] = useState<"run" | "submit" | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ProblemExecutionResult | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLanguage && templates.length) {
      const defaultTemplate = templates.find((t) => t.languageName === "Cpp") ?? templates[0];
      dispatch(setLanguage(defaultTemplate.languageName));
    }
  }, [templates]);

  useEffect(() => {
    if (!selectedLanguage) return;

    const existingCode = codeByProblem[problemId]?.[selectedLanguage];
    if (existingCode !== undefined) return;

    const template = templates.find((t) => t.languageName === selectedLanguage);
    if (template) {
      dispatch(
        setCode({
          problemId,
          language: selectedLanguage,
          code: template.starterCode,
        }),
      );
    }
  }, [selectedLanguage, problemId, templates]);

  const execute = async (endpoint: "run" | "submit") => {
    const template = templates.find((t) => t.languageName === selectedLanguage);
    if (!template) return;

    console.log(`Executing ${endpoint} for problem ${problemId} in language ${selectedLanguage}`);

    setMode(endpoint);
    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionError(null);

    try {
      const response = await api.post(`/problems/${problemId}/${endpoint}`, {
        sourceCode: code,
        languageId: template.languageId,
      });

      const sessionId: string = response.data.data.sessionId;
      const topic = endpoint === "run" ? "problem-run-result" : "submission-result";

      const subscription = socket.subscribe(`/topic/${topic}/${sessionId}`, (message) => {
        const result: ProblemExecutionResult = JSON.parse(message.body);
        console.log(`Received ${endpoint} result for session ${sessionId}:`, result);
        setExecutionResult(result);
        setIsExecuting(false);
        clearTimeout(timeout);
      });

      const timeout = setTimeout(() => {
        setExecutionError("Timed out waiting for a result. Please try again.");
        setIsExecuting(false);
        subscription.unsubscribe();
      }, EXECUTION_TIMEOUT_MS);
    } catch (err) {
      console.error(err);
      setExecutionError("Failed to submit code for execution.");
      setIsExecuting(false);
    }
  };

  const handleRun = () => execute("run");
  const handleSubmit = () => execute("submit");

  const handleReset = () => {
    const template = templates.find((t) => t.languageName === selectedLanguage);
    dispatch(resetCode({ problemId }));
    if (template) {
      dispatch(
        setCode({
          problemId,
          language: selectedLanguage,
          code: template.starterCode,
        }),
      );
    }
    setExecutionResult(null);
    setExecutionError(null);
    setMode(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-border flex h-11 items-center justify-between border-b px-3">
        <Select value={selectedLanguage} onValueChange={(value) => dispatch(setLanguage(value))}>
          <SelectTrigger className="h-7 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {templates.map((template) => (
              <SelectItem
                key={template.languageId}
                value={template.languageName}
                className="text-xs"
              >
                {template.languageName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleRun}
            disabled={isExecuting}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            {isExecuting && mode === "run" ? "Running..." : "Run"}
          </Button>

          <Button
            size="sm"
            className="h-7 bg-green-600 text-xs text-white hover:bg-green-700"
            onClick={handleSubmit}
            disabled={isExecuting}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {isExecuting && mode === "submit" ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase()}
              value={code}
              onChange={(value) =>
                dispatch(
                  setCode({
                    problemId,
                    language: selectedLanguage,
                    code: value ?? "",
                  }),
                )
              }
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                padding: { top: 12 },
                renderLineHighlight: "line",
                tabSize: 4,
                wordWrap: "on",
              }}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={15}>
            <div className="h-full overflow-hidden border-t">
              <OutputPanel
                mode={mode}
                isExecuting={isExecuting}
                result={executionResult}
                error={executionError}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
