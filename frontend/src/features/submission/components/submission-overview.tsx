// features/submission/components/SubmissionOverview.tsx
import { Clock, HardDrive, CheckCircle2, FileCode2 } from "lucide-react";
import type { Submission, SubmissionStatus } from "@/types/submissions";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_HEADING_COLOR: Record<SubmissionStatus, string> = {
  Accepted: "text-green-500",
  "Wrong Answer": "text-red-500",
  "Time Limit Exceeded": "text-yellow-500",
  "Runtime Error": "text-orange-500",
  "Compilation Error": "text-purple-500",
  "Memory Limit Exceeded": "text-blue-500",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
  rust: "Rust",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border bg-muted/30 flex flex-col gap-1 rounded-lg border p-3">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </div>
      <p className="font-mono text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SubmissionOverviewProps {
  status: Submission["status"];
  submittedAt: Submission["submittedAt"];
  language: Submission["language"];
  runtime: Submission["runtime"];
  memory: Submission["memory"];
  passedCount: number;
  totalCount: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SubmissionOverview({
  status,
  submittedAt,
  language,
  runtime,
  memory,
  passedCount,
  totalCount,
}: SubmissionOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Status heading */}
      <div className="space-y-0.5">
        <h1 className={`text-2xl font-bold ${STATUS_HEADING_COLOR[status]}`}>
          {status}
        </h1>
        <p className="text-muted-foreground text-xs">
          Submitted on {formatDate(submittedAt)} ·{" "}
          {LANGUAGE_LABELS[language] ?? language}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Runtime"
          value={runtime}
        />
        <StatCard
          icon={<HardDrive className="h-3.5 w-3.5" />}
          label="Memory"
          value={memory}
        />
        <StatCard
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Test Cases"
          value={`${passedCount} / ${totalCount}`}
        />
        <StatCard
          icon={<FileCode2 className="h-3.5 w-3.5" />}
          label="Language"
          value={LANGUAGE_LABELS[language] ?? language}
        />
      </div>
    </div>
  );
}