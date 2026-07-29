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

import type { Language } from "@/types/problem-detail";
import { useEffect } from "react";

export function EditorPanel({
  problemId,
  languages,
}: {
  problemId: number;
  languages: Language[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  const { selectedLanguage, codeByProblem } = useSelector(
    (state: RootState) => state.problemEditor,
  );

  const code = codeByProblem[problemId]?.[selectedLanguage] ?? "";

  useEffect(() => {
    if (!selectedLanguage && languages.length) {
      dispatch(setLanguage(languages.find((l) => l.name === "C++")?.name ?? languages[0].name));
    }
  }, [languages]);
  const handleRun = () => {
    console.log({
      problemId,
      language: selectedLanguage,
      code,
    });
  };

  const handleSubmit = () => {
    console.log({
      problemId,
      language: selectedLanguage,
      code,
    });
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
            {languages.map((language) => (
              <SelectItem key={language.id} value={language.name} className="text-xs">
                {language.name}
                {language.version && ` (${language.version})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => dispatch(resetCode({ problemId }))}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleRun}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Run
          </Button>

          <Button
            size="sm"
            className="h-7 bg-green-600 text-xs text-white hover:bg-green-700"
            onClick={handleSubmit}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
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
      </div>
    </div>
  );
}
