import { useEffect, useState } from "react";
import { api } from "@/services/axios-interceptor";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const LIMIT = 50;

interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  problemsSolved: number;
}

function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/submissions/leaderboard", {
        params: { limit: LIMIT },
      })
      .then((res) => {
        setEntries(res.data);
        setError(null);
      })
      .catch(() => setError("Couldn't load the leaderboard. Try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-screen w-full space-y-4 overflow-y-auto p-6">
      <h1 className="text-lg font-semibold tracking-tight">Leaderboard</h1>

      {loading && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No submissions yet — be the first to solve a problem.
        </p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {entries.map((entry) => (
            <Card key={entry.userId}>
              <CardContent className="flex items-center gap-3 p-3">
                <RankBadge rank={entry.rank} />

                <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase">
                  {entry.username.slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.username}</p>
                  <p className="text-muted-foreground text-xs">{entry.problemsSolved} solved</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 shrink-0 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 shrink-0 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 shrink-0 text-amber-600" />;
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground h-5 min-w-5 shrink-0 justify-center px-1 font-normal"
    >
      {rank}
    </Badge>
  );
}

export default Leaderboard;
