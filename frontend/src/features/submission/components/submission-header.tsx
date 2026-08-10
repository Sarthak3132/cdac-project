import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VERDICT_TO_STATUS } from "@/types/submissions";
import type { SubmissionVerdict, SubmissionStatus } from "@/types/submissions";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  Accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  "Wrong Answer": "bg-red-500/10 text-red-600 border-red-500/20",
  "Time Limit Exceeded": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  "Runtime Error": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Compilation Error": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Memory Limit Exceeded": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

interface SubmissionHeaderProps {
  id: number;
  verdict: SubmissionVerdict;
}

export function SubmissionHeader({ id, verdict }: SubmissionHeaderProps) {
  const navigate = useNavigate();
  const status = verdict === "PENDING" ? null : VERDICT_TO_STATUS[verdict];

  return (
    <header className="border-border bg-background flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
      <Button
        variant="ghost" size="sm" onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground -ml-1 h-8 gap-1.5 px-2 text-xs"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Problem
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-muted-foreground font-mono text-xs">#{id}</span>
      <div className="ml-auto">
        <Badge
          variant="outline"
          className={`text-xs font-semibold ${status ? STATUS_STYLES[status] : "bg-muted text-muted-foreground"}`}
        >
          {status ?? "Pending"}
        </Badge>
      </div>
    </header>
  );
}