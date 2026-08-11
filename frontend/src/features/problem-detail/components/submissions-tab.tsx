import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { fetchSubmissionsForProblem } from "@/features/submission/api/submission-api";
import { VERDICT_TO_STATUS } from "@/types/submissions";
import type { SubmissionListItem, SubmissionStatus } from "@/types/submissions";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  Accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  "Wrong Answer": "bg-red-500/10 text-red-600 border-red-500/20",
  "Time Limit Exceeded": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  "Runtime Error": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Compilation Error": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Memory Limit Exceeded": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "Cpp", python: "Python", java: "Java",
  javascript: "JavaScript", typescript: "TypeScript", go: "Go", rust: "Rust",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
const formatRuntime = (ms: number | null) => (ms == null ? "—" : `${ms} ms`);
const formatMemory = (kb: number | null) => (kb == null ? "—" : `${(kb / 1024).toFixed(1)} MB`);

interface SubmissionsTabProps {
  problemId: number;
}

export function SubmissionsTab({ problemId }: SubmissionsTabProps) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSubmissionsForProblem(problemId)
      .then((data) => !cancelled && setSubmissions(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [problemId]);

  if (loading) return <div className="text-muted-foreground p-6 text-sm">Loading submissions…</div>;
  if (error) return <div className="p-6 text-sm text-red-500">Couldn't load submissions.</div>;

  if (submissions.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center text-sm">
        No submissions yet.
        <br />
        Submit your solution to see results here.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Runtime</TableHead>
          <TableHead>Memory</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((sub) => {
          const status = sub.verdict === "PENDING" ? null : VERDICT_TO_STATUS[sub.verdict];
          return (
            <TableRow
              key={sub.id}
              className="cursor-pointer"
              onClick={() => navigate(`/app/submission/${sub.id}`)}
            >
              <TableCell>
                <Badge variant="outline" className={`text-xs font-medium ${status ? STATUS_STYLES[status] : ""}`}>
                  {status ?? "Pending"}
                </Badge>
              </TableCell>
              <TableCell>{LANGUAGE_LABELS[sub.language] ?? sub.language}</TableCell>
              <TableCell>{formatRuntime(sub.cpuTimeMs)}</TableCell>
              <TableCell>{formatMemory(sub.memoryUsageKb)}</TableCell>
              <TableCell>{formatDate(sub.submittedAt)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost" size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                  onClick={(e) => { e.stopPropagation(); navigate(`/app/submission/${sub.id}`); }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}