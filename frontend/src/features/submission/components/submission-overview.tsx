import { Clock, HardDrive, CheckCircle2, FileCode2 } from "lucide-react";
import { VERDICT_TO_STATUS } from "@/types/submissions";
import type { SubmissionVerdict } from "@/types/submissions";

const STATUS_HEADING_COLOR: Record<string, string> = {
  Accepted: "text-green-500",
  "Wrong Answer": "text-red-500",
  "Time Limit Exceeded": "text-yellow-500",
  "Runtime Error": "text-orange-500",
  "Compilation Error": "text-purple-500",
  "Memory Limit Exceeded": "text-blue-500",
  Pending: "text-muted-foreground",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "Cpp", python: "Python", java: "Java",
  javascript: "JavaScript", typescript: "TypeScript", go: "Go", rust: "Rust",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-border bg-muted/30 flex flex-col gap-1 rounded-lg border p-3">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">{icon}{label}</div>
      <p className="font-mono text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

interface SubmissionOverviewProps {
  verdict: SubmissionVerdict;
  submittedAt: string;
  language: string;
  cpuTimeMs: number | null;
  memoryUsageKb: number | null;
  passedTestcases: number;
  totalTestcases: number;
}

export function SubmissionOverview({
  verdict, submittedAt, language, cpuTimeMs, memoryUsageKb, passedTestcases, totalTestcases,
}: SubmissionOverviewProps) {
  const status = verdict === "PENDING" ? "Pending" : VERDICT_TO_STATUS[verdict];
  const runtime = cpuTimeMs == null ? "—" : `${cpuTimeMs} ms`;
  const memory = memoryUsageKb == null ? "—" : `${(memoryUsageKb / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className={`text-2xl font-bold ${STATUS_HEADING_COLOR[status]}`}>{status}</h1>
        <p className="text-muted-foreground text-xs">
          Submitted on {formatDate(submittedAt)} · {LANGUAGE_LABELS[language] ?? language}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard icon={<Clock className="h-3.5 w-3.5" />} label="Runtime" value={runtime} />
        <StatCard icon={<HardDrive className="h-3.5 w-3.5" />} label="Memory" value={memory} />
        <StatCard icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Test Cases" value={`${passedTestcases} / ${totalTestcases}`} />
        <StatCard icon={<FileCode2 className="h-3.5 w-3.5" />} label="Language" value={LANGUAGE_LABELS[language] ?? language} />
      </div>
    </div>
  );
}