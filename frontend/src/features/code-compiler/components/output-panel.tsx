import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function OutputPanel({ output, isRunning }: { output: string | null; isRunning: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 shrink-0 items-center justify-between border-b px-4">
        <span className="text-muted-foreground text-sm font-medium">Output</span>
        {output && (
          <Badge variant="secondary" className="text-xs">
            Finished
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
          {!isRunning && output === null && (
            <p className="text-muted-foreground text-sm">Click Run to see output here.</p>
          )}
          {!isRunning && output !== null && (
            <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
