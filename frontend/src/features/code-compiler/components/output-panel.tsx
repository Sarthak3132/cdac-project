import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface OutputPanelProps {
  status: string | null;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  isRunning: boolean;
}

export function OutputPanel({
  status,
  stdout,
  stderr,
  compileOutput,
  isRunning,
}: OutputPanelProps) {
  const hasError = !!(stderr || compileOutput);
  const isAccepted = status === "Accepted";

  const statusVariant = isRunning
    ? "secondary"
    : isAccepted
      ? "default"
      : status
        ? "destructive"
        : "secondary";

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 shrink-0 items-center justify-between border-b px-4">
        <span className="text-muted-foreground text-sm font-medium">Output</span>
        {status && !isRunning && (
          <Badge variant={statusVariant} className="text-xs">
            {status}
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 font-mono text-sm">
          {isRunning && (
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </div>
          )}

          {!isRunning && !status && (
            <p className="text-muted-foreground text-sm">Click Run to see output here.</p>
          )}

          {!isRunning && status && (
            <div className="space-y-3">
              {compileOutput && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-red-500">Compilation Error</p>
                  <pre className="whitespace-pre-wrap text-red-500">{compileOutput}</pre>
                </div>
              )}

              {stdout && <pre className="text-foreground whitespace-pre-wrap">{stdout}</pre>}

              {stderr && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-red-500">Runtime Error</p>
                  <pre className="whitespace-pre-wrap text-red-500">{stderr}</pre>
                </div>
              )}

              {!compileOutput && !stdout && !stderr && !hasError && (
                <p className="text-muted-foreground text-sm">(no output)</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
