// features/submission/components/TestCaseResults.tsx
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Submission } from "@/types/submissions";

// ─── CellBlock ────────────────────────────────────────────────────────────────

function CellBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1 p-3">
      <p
        className={`text-xs font-medium tracking-wide uppercase ${
          highlight ? "text-red-500" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <pre className="font-mono text-xs whitespace-pre-wrap">{value}</pre>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TestCaseResultsProps {
  testCases: Submission["testCases"];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TestCaseResults({ testCases }: TestCaseResultsProps) {
  const passedCount = testCases.filter((t) => t.status === "Passed").length;
  const totalCount = testCases.length;

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Test Case Results</h2>
        <span className="text-muted-foreground text-xs">
          {passedCount}/{totalCount} passed
        </span>
      </div>

      <div className="space-y-2">
        {testCases.map((tc, i) => (
          <div key={i} className="border-border overflow-hidden rounded-lg border">

            {/* Case header */}
            <div
              className={`flex items-center justify-between px-3 py-2 ${
                tc.status === "Passed" ? "bg-green-500/5" : "bg-red-500/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {tc.status === "Passed" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">{tc.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {tc.runtime && (
                  <span className="text-muted-foreground font-mono text-xs">
                    {tc.runtime}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={
                    tc.status === "Passed"
                      ? "border-green-500/20 bg-green-500/10 text-xs text-green-600"
                      : "border-red-500/20 bg-red-500/10 text-xs text-red-600"
                  }
                >
                  {tc.status}
                </Badge>
              </div>
            </div>

            {/* Input / Expected / Got */}
            {(tc.input || tc.expectedOutput || tc.actualOutput) && (
              <div className="divide-border grid grid-cols-3 divide-x">
                {tc.input && <CellBlock label="Input" value={tc.input} />}
                {tc.expectedOutput && (
                  <CellBlock label="Expected" value={tc.expectedOutput} />
                )}
                {tc.actualOutput && (
                  <CellBlock
                    label="Got"
                    value={tc.actualOutput}
                    highlight={tc.status === "Failed"}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}