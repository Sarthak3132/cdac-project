// components/problem/OutputPanel.tsx
import { useSelector } from "react-redux";
import { CheckCircle2, XCircle, Clock, MemoryStick, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RootState } from "@/app/store";
import { cn } from "@/lib/utils";

export function OutputPanel() {
  // const { runResult, submitResult, isRunning, isSubmitting } = useSelector(
  //   (state: RootState) => state.problem,
  // );

  // const isLoading = isRunning || isSubmitting;

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 items-center border-b px-4">
        <span className="text-sm font-medium">Output</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Loading */}
          {/* {isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isRunning ? "Running code..." : "Submitting..."}
            </div>
          )} */}

          {/* Submit Result */}
          {/* {submitResult && (
            <div className="space-y-3">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg p-3",
                  submitResult.status === "accepted"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600",
                )}
              >
                {submitResult.status === "accepted" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-semibold capitalize">
                  {submitResult.status.replace("_", " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatCard
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  label="Tests Passed"
                  value={`${submitResult.passedCount}/${submitResult.totalCount}`}
                />
                {submitResult.runtime && (
                  <StatCard
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Runtime"
                    value={submitResult.runtime}
                  />
                )}
                {submitResult.memory && (
                  <StatCard
                    icon={<MemoryStick className="h-3.5 w-3.5" />}
                    label="Memory"
                    value={submitResult.memory}
                  />
                )}
              </div>
              {submitResult.error && (
                <pre className="rounded-md bg-red-500/5 p-3 font-mono text-xs whitespace-pre-wrap text-red-600">
                  {submitResult.error}
                </pre>
              )}
            </div>
          )} */}

          {/* Run Result */}
          {/* {runResult && (
            <div className="space-y-3">
              {runResult.compilerError ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Compiler Error</span>
                  </div>
                  <pre className="rounded-md bg-red-500/5 p-3 font-mono text-xs whitespace-pre-wrap text-red-600">
                    {runResult.compilerError}
                  </pre>
                </div>
              ) : (
                runResult.results.map((r, i) => (
                  <div key={r.id} className="border-border overflow-hidden rounded-lg border">
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2",
                        r.passed ? "bg-green-500/10" : "bg-red-500/10",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {r.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-xs font-medium">
                          Test Case {i + 1} — {r.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-3 text-xs">
                        {r.runtime && <span>{r.runtime}</span>}
                        {r.memory && <span>{r.memory}</span>}
                      </div>
                    </div>
                    {!r.passed && (
                      <div className="divide-border grid grid-cols-2 divide-x text-xs">
                        <div className="space-y-1 p-2">
                          <p className="text-muted-foreground font-medium">Expected</p>
                          <pre className="font-mono whitespace-pre-wrap">{r.expectedOutput}</pre>
                        </div>
                        <div className="space-y-1 p-2">
                          <p className="text-muted-foreground font-medium">Got</p>
                          <pre className="font-mono whitespace-pre-wrap">{r.actualOutput}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )} */}

          {/* Empty */}
          {/* {!isLoading && !runResult && !submitResult && (
            <p className="text-muted-foreground text-sm">Run your code to see output here.</p>
          )} */}
        </div>
      </ScrollArea>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted space-y-0.5 rounded-md p-2">
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
