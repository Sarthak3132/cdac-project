// pages/app/problem-submission.tsx
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getSubmissionById } from "@/features/submission/data/dummy-submission";
import { SubmissionHeader } from "@/features/submission/components/submission-header";
import { SubmissionOverview } from "@/features/submission/components/submission-overview";
import { TestCaseResults } from "@/features/submission/components/testcase-results";
import { SourceCodePanel } from "@/features/submission/components/sourcecode-panel";

export default function ProblemSubmission() {
  const navigate = useNavigate();
  const { id: submissionId } = useParams<{ id: string }>();

  const submission = submissionId ? getSubmissionById(submissionId) : undefined;

  // ── Error / empty state ───────────────────────────────────────────────────
  if (!submission) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-muted rounded-full p-4">
          <AlertCircle className="text-muted-foreground h-6 w-6" />
        </div>
        <div>
          <p className="font-medium">Submission not found</p>
          <p className="text-muted-foreground text-sm">
            We couldn't find submission{" "}
            <code className="font-mono text-xs">{submissionId}</code>.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Problem
        </Button>
      </div>
    );
  }

  const passedCount = submission.testCases.filter((t) => t.status === "Passed").length;
  const totalCount = submission.testCases.length;

  return (
    <div className="flex h-screen flex-col overflow-hidden">

      {/* 1. Top bar — id + status badge + back navigation */}
      <SubmissionHeader id={submission.id} status={submission.status} />

      {/* 2. Body: 50/50 split */}
      <div className="flex min-h-0 flex-1">

        {/* LEFT: overview + test cases */}
        <div className="border-border flex w-1/2 min-w-0 flex-col border-r">
          <ScrollArea className="flex-1">
            <div className="space-y-5 p-5">

              {/* 3. Status heading + 4 stat cards */}
              <SubmissionOverview
                status={submission.status}
                submittedAt={submission.submittedAt}
                language={submission.language}
                runtime={submission.runtime}
                memory={submission.memory}
                passedCount={passedCount}
                totalCount={totalCount}
              />

              <Separator />

              {/* 4. Test case rows with input/expected/got */}
              <TestCaseResults testCases={submission.testCases} />

            </div>
          </ScrollArea>
        </div>

        {/* 5. RIGHT: Monaco editor — only needs sourceCode + language */}
        <SourceCodePanel
          sourceCode={submission.sourceCode}
          language={submission.language}
        />

      </div>
    </div>
  );
}