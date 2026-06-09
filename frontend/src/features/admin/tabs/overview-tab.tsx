// features/admin/tabs/OverviewTab.tsx
import { TrendingUp, TrendingDown, Minus, Users, Code2, Send, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STAT_CARDS, ADMIN_SUBMISSIONS, ADMIN_USERS } from "../data/dummy-admin-data";
import type { StatCard } from "@/types/admin-dashboard";

const ICON_MAP: Record<string, React.ElementType> = {
  users: Users,
  code: Code2,
  send: Send,
  "chart-bar": BarChart2,
};

function StatCardItem({ card }: { card: StatCard }) {
  const Icon = ICON_MAP[card.icon] ?? BarChart2;
  return (
    <div className="border-border bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{card.label}</p>
        <div className="bg-muted rounded-md p-1.5">
          <Icon className="text-muted-foreground h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold">{card.value}</p>
      <div className="flex items-center gap-1 text-xs">
        {card.trend === "up" ? (
          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
        ) : card.trend === "down" ? (
          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
        ) : (
          <Minus className="text-muted-foreground h-3.5 w-3.5" />
        )}
        <span
          className={
            card.trend === "up"
              ? "text-green-600"
              : card.trend === "down"
                ? "text-red-600"
                : "text-muted-foreground"
          }
        >
          {card.change}
        </span>
        <span className="text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  Accepted: "bg-green-500/10 text-green-700 border-green-500/20",
  "Wrong Answer": "bg-red-500/10   text-red-700   border-red-500/20",
  TLE: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  "Compile Error": "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Runtime Error": "bg-red-500/10   text-red-700   border-red-500/20",
};

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((c) => (
          <StatCardItem key={c.label} card={c} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent submissions */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-4 py-3">
            <p className="text-sm font-semibold">Recent Submissions</p>
          </div>
          <div className="divide-border divide-y">
            {ADMIN_SUBMISSIONS.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{s.problem}</p>
                  <p className="text-muted-foreground text-xs">
                    {s.user} · {s.submittedAt}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-2 shrink-0 text-xs ${STATUS_STYLE[s.status]}`}
                >
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top users */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-4 py-3">
            <p className="text-sm font-semibold">Top Users</p>
          </div>
          <div className="divide-border divide-y">
            {[...ADMIN_USERS]
              .sort((a, b) => b.solved - a.solved)
              .slice(0, 5)
              .map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-muted-foreground w-4 text-xs">{i + 1}</span>
                  <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{u.name}</p>
                    <p className="text-muted-foreground text-xs">{u.email}</p>
                  </div>
                  <span className="text-xs font-semibold">{u.solved} solved</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
