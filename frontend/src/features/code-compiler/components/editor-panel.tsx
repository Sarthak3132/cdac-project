"use client";

import { useTheme } from "@/hooks/use-theme";
import Editor from "@monaco-editor/react";

export function EditorPanel({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (v: string | undefined) => void;
}) {
  console.log("EditorPanel rendered with language:", language, "and value:", value);
  const themecontext = useTheme();
  return (
    <Editor
      height="100%"
      theme={themecontext.theme === "dark" ? "vs-dark" : "light"}
      language={language.toLocaleLowerCase()}
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
