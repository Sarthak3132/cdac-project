// features/submission/components/SourceCodePanel.tsx
import { FileCode2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Editor } from "@monaco-editor/react";
import type { Submission } from "@/types/submissions";
import { useTheme } from "@/hooks/use-theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
  rust: "Rust",
};

const LANGUAGE_MONACO: Record<string, string> = {
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SourceCodePanelProps {
  sourceCode: Submission["sourceCode"];
  language: Submission["language"];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SourceCodePanel({ sourceCode, language }: SourceCodePanelProps) {
  const monacoLang = LANGUAGE_MONACO[language] ?? "plaintext";
  const languageLabel = LANGUAGE_LABELS[language] ?? language;

  const themeContext = useTheme()

  return (
    <div className="flex w-1/2 min-w-0 flex-col">
      {/* Panel header */}
      <div className="border-border bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileCode2 className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-sm font-semibold">Source Code</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Read-only</span>
          <Badge variant="secondary" className="text-xs">
            {languageLabel}
          </Badge>
        </div>
      </div>

      {/* Monaco editor — fills remaining height */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={monacoLang}
          value={sourceCode}
          theme="vs-dark"
          options={{
            theme: themeContext.theme === "dark" ? "vs-dark" : "light",
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "none",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            contextmenu: false,
            folding: true,
            glyphMargin: false,
          }}
        />
      </div>
    </div>
  );
}