import { useTheme } from "@/hooks/use-theme";
import Editor from "@monaco-editor/react";

interface EditorPanelProps {
  language: string;
  value: string;
  onChange: (v: string | undefined) => void;
  height?: string;
}

export function EditorPanel({ language, value, onChange, height = "100%" }: EditorPanelProps) {
  const themecontext = useTheme();

  return (
    <Editor
      height={height}
      theme={themecontext.theme === "dark" ? "vs-dark" : "light"}
      language={language.toLowerCase()}
      value={value}
      onChange={onChange}
      options={{
        fontSize: 14,
        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        padding: { top: 12 },
        renderLineHighlight: "line",
        tabSize: 4,
      }}
    />
  );
}
