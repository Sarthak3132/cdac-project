import { CheckCircle2, Clock } from "lucide-react";
import { dummyProblems } from "@/features/problem-set/data/dummy-problems";
import type {
  AttemptedCardProps,
  DifficultyCardProps,
  OverallCardProps,
} from "@/types/probelm-set";

// ── replace with real Redux selector later ──
const DUMMY_SOLVED = new Set([1, 2, 5, 7, 9, 12, 14]);
const DUMMY_ATTEMPTED = new Set([3, 6, 8]); // attempted but not solved

function DifficultyCard({
  label,
  solved,
  total,
  colorClass,
  barClass,
  iconClass,
}: DifficultyCardProps) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="border-border bg-background rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs font-medium ${colorClass}`}>{label}</span>
        <CheckCircle2 className={`h-4 w-4 ${iconClass}`} />
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{solved}</p>
      <p className="text-muted-foreground text-xs">/ {total} problems</p>
      <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={`h-1.5 rounded-full transition-all ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OverallCard({ solved, total, pct }: OverallCardProps) {
  return (
    <div className="border-border  bg-background col-span-2 flex items-center gap-5 rounded-lg border p-4 md:col-span-1">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm leading-none font-bold">{solved}</span>
          <span className="text-muted-foreground text-[10px]">solved</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">Total Solved</p>
        <p className="text-muted-foreground text-xs">
          {solved} / {total} problems
        </p>
        <p className="text-primary mt-1 text-xs font-medium">{pct}% complete</p>
      </div>
    </div>
  );
}

function AttemptedCard({ attempted, total }: AttemptedCardProps) {
  const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
  return (
    <div className="border-border bg-background rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-blue-600">Attempted</span>
        <Clock className="h-4 w-4 text-blue-500" />
      </div>
      <p className="text-2xl font-bold text-blue-600">{attempted}</p>
      <p className="text-muted-foreground text-xs">/ {total} problems</p>
      <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="h-1.5 rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StatsBar() {
  const totalEasy = dummyProblems.filter((p) => p.level === "Easy").length;
  const totalMedium = dummyProblems.filter((p) => p.level === "Medium").length;
  const totalHard = dummyProblems.filter((p) => p.level === "Hard").length;
  const totalAll = dummyProblems.length;

  const solvedEasy = dummyProblems.filter(
    (p) => p.level === "Easy" && DUMMY_SOLVED.has(p.id),
  ).length;
  const solvedMedium = dummyProblems.filter(
    (p) => p.level === "Medium" && DUMMY_SOLVED.has(p.id),
  ).length;
  const solvedHard = dummyProblems.filter(
    (p) => p.level === "Hard" && DUMMY_SOLVED.has(p.id),
  ).length;
  const totalSolved = DUMMY_SOLVED.size;
  const totalAttempted = DUMMY_ATTEMPTED.size;
  const solvedPct = Math.round((totalSolved / totalAll) * 100);

  return (
    <div className="border-border bg-muted/30 shrink-0 border-b px-6 py-4">
      <div className="mx-auto grid w-full grid-cols-2 gap-4 md:grid-cols-5">
        <OverallCard solved={totalSolved} total={totalAll} pct={solvedPct} />
        <AttemptedCard attempted={totalAttempted} total={totalAll} />
        <DifficultyCard
          label="Easy"
          solved={solvedEasy}
          total={totalEasy}
          colorClass="text-green-600"
          barClass="bg-green-500"
          iconClass="text-green-500"
        />
        <DifficultyCard
          label="Medium"
          solved={solvedMedium}
          total={totalMedium}
          colorClass="text-yellow-600"
          barClass="bg-yellow-500"
          iconClass="text-yellow-500"
        />
        <DifficultyCard
          label="Hard"
          solved={solvedHard}
          total={totalHard}
          colorClass="text-red-600"
          barClass="bg-red-500"
          iconClass="text-red-500"
        />
      </div>
    </div>
  );
}
