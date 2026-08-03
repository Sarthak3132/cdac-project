import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ProblemExecutionResult } from "./editor-panel";

interface OutputPanelProps {
  mode: "run" | "submit" | null;
  isExecuting: boolean;
  result: ProblemExecutionResult | null;
  error: string | null;
}

function verdictVariant(status: string): "default" | "destructive" | "secondary" {
  return status === "Accepted" ? "default" : "destructive";
}

export function OutputPanel({ mode, isExecuting, result, error }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 shrink-0 items-center justify-between border-b px-4">
        <span className="text-muted-foreground text-sm font-medium">
          {mode === "submit" ? "Submission Result" : "Test Result"}
        </span>

        {result && !isExecuting && (
          <Badge variant={verdictVariant(result.overallStatus)} className="text-xs">
            {result.overallStatus}
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 font-mono text-sm">
          {isExecuting && (
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "submit"
                ? "Judging against all test cases..."
                : "Running visible test cases..."}
            </div>
          )}

          {!isExecuting && error && <p className="text-red-500">{error}</p>}

          {!isExecuting && !error && !result && (
            <p className="text-muted-foreground">
              Click <strong>Run</strong> to test against visible test cases or{" "}
              <strong>Submit</strong> to judge against all hidden test cases.
            </p>
          )}

          {/* Run Result */}
          {!isExecuting && !error && result && mode === "run" && (
            <div className="space-y-4">
              {result.results.map((tc, index) => (
                <div key={tc.testCaseId} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold">Test Case {index + 1}</span>

                    {tc.passed ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-500">
                        <XCircle className="h-4 w-4" />
                        {tc.statusDescription}
                      </span>
                    )}
                  </div>

                  {tc.inputData && (
                    <div className="mb-4">
                      <p className="text-muted-foreground mb-1 text-xs">Input</p>
                      <pre className="bg-muted rounded p-2 whitespace-pre-wrap">{tc.inputData}</pre>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">Expected Output</p>
                      <pre className="bg-muted rounded p-2 whitespace-pre-wrap">
                        {tc.expectedOutput}
                      </pre>
                    </div>

                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">Your Output</p>
                      <pre
                        className={`bg-muted rounded p-2 whitespace-pre-wrap ${
                          tc.passed ? "" : "text-red-500"
                        }`}
                      >
                        {tc.actualOutput || tc.stderr || "(no output)"}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Result */}
          {!isExecuting && !error && result && mode === "submit" && (
            <div className="space-y-4">
              <p className="text-base font-semibold">
                {result.passedCount} / {result.totalCount} test cases passed
              </p>

              {result.overallStatus !== "Accepted" &&
                (() => {
                  const failing = result.results.find((r) => !r.passed);

                  if (!failing) return null;

                  return (
                    <div className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-center gap-2 font-semibold text-red-500">
                        <XCircle className="h-4 w-4" />
                        {failing.statusDescription}
                      </div>

                      {failing.inputData && (
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Input</p>
                          <pre className="bg-muted rounded p-2 whitespace-pre-wrap">
                            {failing.inputData}
                          </pre>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Expected Output</p>
                          <pre className="bg-muted rounded p-2 whitespace-pre-wrap">
                            {failing.expectedOutput}
                          </pre>
                        </div>

                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Your Output</p>
                          <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-red-500">
                            {failing.actualOutput || failing.stderr || "(no output)"}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
