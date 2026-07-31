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
import { useEffect } from "react";
import { OutputPanel } from "./output-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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

  // Pick a default language once templates load
  useEffect(() => {
    if (!selectedLanguage && templates.length) {
      const defaultTemplate = templates.find((t) => t.languageName === "Cpp") ?? templates[0];
      dispatch(setLanguage(defaultTemplate.languageName));
    }
  }, [templates]);

  // Seed the editor with boilerplate whenever the active language
  // has no saved code yet for this problem
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

  const handleRun = () => {
    console.log({ problemId, language: selectedLanguage, code });
  };

  const handleSubmit = () => {
    console.log({ problemId, language: selectedLanguage, code });
  };

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
              <OutputPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
