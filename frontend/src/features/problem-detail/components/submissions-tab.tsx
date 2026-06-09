// components/problem/SubmissionsTab.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { DUMMY_SUBMISSIONS } from "@/features/submission/data/dummy-submission";
import type { SubmissionStatus } from "@/types/submissions";
import { Clock, ExternalLink, HardDrive } from "lucide-react";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  Accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  "Wrong Answer": "bg-red-500/10 text-red-600 border-red-500/20",
  "Time Limit Exceeded": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  "Runtime Error": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Compilation Error": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Memory Limit Exceeded": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
  rust: "Rust",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SubmissionsTab() {
  const navigate = useNavigate();

  const submissions = [...DUMMY_SUBMISSIONS].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  if (submissions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="bg-muted rounded-full p-4">
          <Clock className="text-muted-foreground h-6 w-6" />
        </div>
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
        <p className="text-muted-foreground text-xs">Submit your solution to see results here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Language</TableHead>
              <TableHead className="text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Runtime
                </span>
              </TableHead>
              <TableHead className="text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> Memory
                </span>
              </TableHead>
              <TableHead className="text-xs font-semibold">Submitted</TableHead>
              <TableHead className="text-right text-xs font-semibold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-muted/40 cursor-pointer transition-colors">
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${STATUS_STYLES[sub.status]}`}
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {LANGUAGE_LABELS[sub.language] ?? sub.language}
                </TableCell>
                <TableCell className="font-mono text-sm">{sub.runtime}</TableCell>
                <TableCell className="font-mono text-sm">{sub.memory}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDate(sub.submittedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/submission/${sub.id}`);
                    }}
                  >
                    View
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
