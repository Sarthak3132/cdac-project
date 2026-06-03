import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../components/ui/resizable";
import { LanguageSidebar } from "../../features/code-compiler/components/language-sidebar";
import { EditorPanel } from "../../features/code-compiler/components/editor-panel";
import { OutputPanel } from "../../features/code-compiler/components/output-panel";
import { LANGUAGES } from "../../features/code-compiler/data/dummy-data";
import type { Language } from "../../types/code-compiler";
import { Button } from "../../components/ui/button";

export function CodeCompiler() {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleLangChange = (lang: Language) => {
    setSelectedLang(lang);
    setCode(lang.defaultCode);
    setOutput(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    // Replace with your actual execution API
    await new Promise((r) => setTimeout(r, 800));
    setOutput("Start small. Ship something.");
    setIsRunning(false);
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
      <LanguageSidebar languages={LANGUAGES} selected={selectedLang} onSelect={handleLangChange} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top tab bar */}
        <div className="border-border flex h-10 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="bg-muted text-foreground flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-sm">
              main.{selectedLang.id === "python" ? "py" : selectedLang.id}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCode(selectedLang.defaultCode)}>
              Reset
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        <ResizablePanelGroup className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30}>
            <EditorPanel
              language={selectedLang.monacoId}
              value={code}
              onChange={(v) => setCode(v ?? "")}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={20}>
            <OutputPanel output={output} isRunning={isRunning} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
