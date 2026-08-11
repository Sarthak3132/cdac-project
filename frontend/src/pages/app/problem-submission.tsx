import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { fetchSubmissionDetail } from "@/features/submission/api/submission-api";
import { SubmissionHeader } from "@/features/submission/components/submission-header";
import { SubmissionOverview } from "@/features/submission/components/submission-overview";
import { SubmissionResultDetail } from "@/features/submission/components/submission-result-detail";
import { SourceCodePanel } from "@/features/submission/components/sourcecode-panel";
import type { SubmissionDetail } from "@/types/submissions";

export default function ProblemSubmission() {
  const navigate = useNavigate();
  const { id: submissionId } = useParams<{ id: string }>();

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!submissionId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetchSubmissionDetail(submissionId)
      .then((data) => !cancelled && setSubmission(data))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [submissionId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading submission…</p>
      </div>
    );
  }

  if (notFound || !submission) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-muted rounded-full p-4">
          <AlertCircle className="text-muted-foreground h-6 w-6" />
        </div>
        <div>
          <p className="font-medium">Submission not found</p>
          <p className="text-muted-foreground text-sm">
            We couldn't find submission <code className="font-mono text-xs">{submissionId}</code>.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Problem
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SubmissionHeader id={submission.id} verdict={submission.verdict} />

      <div className="flex min-h-0 flex-1">
        <div className="border-border flex w-1/2 min-w-0 flex-col border-r">
          <ScrollArea className="flex-1">
            <div className="space-y-5 p-5">
              <SubmissionOverview
                verdict={submission.verdict}
                submittedAt={submission.submittedAt}
                language={submission.language}
                cpuTimeMs={submission.cpuTimeMs}
                memoryUsageKb={submission.memoryUsageKb}
                passedTestcases={submission.passedTestcases ?? 0}
                totalTestcases={submission.totalTestcases}
              />
              <Separator />
              <SubmissionResultDetail submission={submission} />
            </div>
          </ScrollArea>
        </div>

        <SourceCodePanel sourceCode={submission.codeBody} language={submission.language} />
      </div>
    </div>
  );
}