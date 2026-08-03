import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { LanguageSidebar } from "../../features/code-compiler/components/language-sidebar";
import { EditorPanel } from "../../features/code-compiler/components/editor-panel";
import { InputPanel } from "../../features/code-compiler/components/input-panel";
import { OutputPanel } from "../../features/code-compiler/components/output-panel";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { setSelectedLanguage, updateCode } from "../../features/code-compiler/slice/compilerSlice";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { api } from "@/services/axios-interceptor";
import { socket } from "@/app/websocket-provider";
import type { Language } from "../../types/code-compiler";

interface CodeExecutionResult {
  sessionId: string;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  statusDescription: string;
  time: number | null;
  memory: number | null;
}

const RUN_TIMEOUT_MS = 20000;

export function CodeCompiler() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLang, setSelectedLang] = useState<Language>({} as Language);
  const [stdin, setStdin] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [stdout, setStdout] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [compileOutput, setCompileOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const code = useSelector((state: RootState) =>
    selectedLang ? (state.compiler.codeByLanguage[selectedLang.name] ?? "") : "",
  );

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get("/languages");
        const data: Language[] = response.data.data;

        setLanguages(data);

        if (data.length > 0) {
          setSelectedLang(data[0]);
          dispatch(setSelectedLanguage(data[0].name));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLanguages();
  }, [dispatch]);

  const clearOutput = () => {
    setStatus(null);
    setStdout(null);
    setStderr(null);
    setCompileOutput(null);
  };

  const handleLangChange = (lang: Language) => {
    setSelectedLang(lang);
    dispatch(setSelectedLanguage(lang.name));
    clearOutput();
  };

  const handleReset = () => {
    if (!selectedLang) return;

    dispatch(
      updateCode({
        languageId: selectedLang.name,
        code: "",
      }),
    );
    clearOutput();
  };

  const handleRun = async () => {
    if (!selectedLang?.id) return;

    setIsRunning(true);
    clearOutput();

    try {
      const response = await api.post("/compiler/run", {
        sourceCode: code,
        languageId: selectedLang.id,
        stdin,
      });

      const sessionId: string = response.data.data.sessionId;

      const subscription = socket.subscribe(`/topic/code-result/${sessionId}`, (message) => {
        const result: CodeExecutionResult = JSON.parse(message.body);

        setStatus(result.statusDescription);
        setStdout(result.stdout);
        setStderr(result.stderr);
        setCompileOutput(result.compileOutput);
        setIsRunning(false);
        clearTimeout(timeout);
      });

      const timeout = setTimeout(() => {
        setStatus("Timed Out");
        setStderr("Timed out waiting for a result. Please try again.");
        setIsRunning(false);
        subscription.unsubscribe();
      }, RUN_TIMEOUT_MS);
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setStderr("Failed to submit code for execution.");
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
      <LanguageSidebar languages={languages} selected={selectedLang} onSelect={handleLangChange} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-border flex h-10 shrink-0 items-center justify-between border-b px-4">
          <div className="bg-muted rounded-md px-3 py-1 font-mono text-sm">
            {selectedLang ? `main${selectedLang.fileExtension}` : "main.txt"}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} disabled={!selectedLang}>
              Reset
            </Button>

            <Button
              size="sm"
              disabled={isRunning || !selectedLang}
              onClick={handleRun}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        <ResizablePanelGroup orientation={isMobile ? "vertical" : "horizontal"} className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30}>
            <EditorPanel
              language={selectedLang?.name ?? "cpp"}
              value={code}
              onChange={(value) =>
                selectedLang &&
                dispatch(
                  updateCode({
                    languageId: selectedLang.name,
                    code: value ?? "",
                  }),
                )
              }
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={20}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel defaultSize={40} minSize={15}>
                <InputPanel value={stdin} onChange={setStdin} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={60} minSize={20}>
                <OutputPanel
                  status={status}
                  stdout={stdout}
                  stderr={stderr}
                  compileOutput={compileOutput}
                  isRunning={isRunning}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
