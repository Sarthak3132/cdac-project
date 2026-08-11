import { CheckCircle2, XCircle } from "lucide-react";
import type { SubmissionDetail } from "@/types/submissions";

function CellBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-1 p-3">
      <p className={`text-xs font-medium tracking-wide uppercase ${highlight ? "text-red-500" : "text-muted-foreground"}`}>
        {label}
      </p>
      <pre className="font-mono text-xs whitespace-pre-wrap">{value}</pre>
    </div>
  );
}

interface SubmissionResultDetailProps {
  submission: SubmissionDetail;
}

export function SubmissionResultDetail({ submission }: SubmissionResultDetailProps) {
  const passed = submission.passedTestcases ?? 0;
  const total = submission.totalTestcases;
  const isAccepted = submission.verdict === "ACCEPTED";

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Test Case Results</h2>
        <span className="text-muted-foreground text-xs">{passed}/{total} passed</span>
      </div>

      {isAccepted ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">All test cases passed</span>
        </div>
      ) : (
        <div className="border-border overflow-hidden rounded-lg border">
          <div className="flex items-center gap-2 bg-red-500/5 px-3 py-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Failed on test case {passed + 1} of {total}</span>
          </div>

          {submission.diagnosticMessage && (
            <div className="border-border border-t p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                {submission.verdict === "COMPILATION_ERROR" ? "Compiler Output" : "Diagnostic"}
              </p>
              <pre className="font-mono text-xs whitespace-pre-wrap text-red-500">{submission.diagnosticMessage}</pre>
            </div>
          )}

          {(submission.failureInput || submission.expectedOutput || submission.actualOutput) && (
            <div className="divide-border grid grid-cols-3 divide-x border-t">
              {submission.failureInput && <CellBlock label="Input" value={submission.failureInput} />}
              {submission.expectedOutput && <CellBlock label="Expected" value={submission.expectedOutput} />}
              {submission.actualOutput && <CellBlock label="Got" value={submission.actualOutput} highlight />}
            </div>
          )}
        </div>
      )}
    </section>
  );
}