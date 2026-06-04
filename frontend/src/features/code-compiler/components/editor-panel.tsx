"use client";

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
  return (
    <Editor
      height="100%"
      language={language}
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
