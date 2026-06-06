// components/problem/EditorPanel.tsx
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Play, RefreshCw, Send } from "lucide-react";
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
import {
  setCode,
  setLanguage,
  resetCode,
  runCode,
  submitCode,
} from "@/features/problem-detail/slice/problemSlice";
import type { RootState, AppDispatch } from "@/app/store";

const LANGUAGES = [
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
];

export function EditorPanel({ problemId }: { problemId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { codeByLanguage, selectedLanguage, isRunning, isSubmitting, useCustomInput, customInput } =
    useSelector((state: RootState) => state.problem);

  const code = codeByLanguage[selectedLanguage] ?? "";

  const handleRun = () => {
    dispatch(
      runCode({
        code,
        language: selectedLanguage,
        input: useCustomInput ? customInput : "",
        problemId,
      }),
    );
  };

  const handleSubmit = () => {
    dispatch(submitCode({ code, language: selectedLanguage, problemId }));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-border flex h-11 items-center justify-between border-b px-3">
        <Select value={selectedLanguage} onValueChange={(val) => dispatch(setLanguage(val))}>
          <SelectTrigger className="h-7 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.id} value={l.id} className="text-xs">
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => dispatch(resetCode())}
            title="Reset code"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-3.5 w-3.5" />
            )}
            Run
          </Button>
          <Button
            size="sm"
            className="h-7 bg-green-600 text-xs text-white hover:bg-green-700"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            Submit
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          onChange={(val) => dispatch(setCode({ language: selectedLanguage, code: val ?? "" }))}
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
      </div>
    </div>
  );
}
