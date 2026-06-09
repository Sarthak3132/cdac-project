import { useState } from "react";
import { Trophy, Flame, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dummyProblems } from "@/features/problem-set/data/dummy-problems";
import { StatsBar } from "@/features/problem-set/components/stats-bar";
import { ProblemFilter } from "@/features/problem-set/components/problem-filter";
import { ProblemTable } from "@/features/problem-set/components/problem-table";

const TOPICS = ["Array", "String", "Hash Table", "Tree", "Graph", "DP", "Linked List"];

export default function ProblemSet() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = dummyProblems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === "All" || p.level === level;
    const matchTopic = !activeTopic || p.tags?.includes(activeTopic);
    return matchSearch && matchLevel && matchTopic;
  });

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleLevel = (v: string) => {
    setLevel(v);
    setPage(1);
  };
  const handleTopic = (t: string) => {
    setActiveTopic((prev) => (prev === t ? null : t));
    setPage(1);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <StatsBar />

      <div className="flex h-screen flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="border-border bg-muted/20 hidden w-52 shrink-0 flex-col gap-4 border-r p-4 md:flex">
          {/* Quick Stats */}
          <Card>
            <CardContent className="space-y-1 p-3">
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                Quick Stats
              </p>
              {[
                {
                  icon: <Trophy className="h-4 w-4 text-yellow-500" />,
                  label: "Rank",
                  value: "#142",
                },
                {
                  icon: <Flame className="h-4 w-4 text-orange-500" />,
                  label: "Solved",
                  value: "7",
                },
                {
                  icon: <Circle className="h-4 w-4 text-blue-500" />,
                  label: "Attempted",
                  value: "3",
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                  {icon}
                  <span className="text-sm">
                    {label} <span className="font-semibold">{value}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Topics */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Topics
            </p>
            <div className="flex flex-col gap-0.5">
              {TOPICS.map((topic) => (
                <Button
                  key={topic}
                  variant={activeTopic === topic ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 justify-start text-sm font-normal"
                  onClick={() => handleTopic(topic)}
                >
                  {topic}
                </Button>
              ))}
              {activeTopic && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTopic(null)}
                  className="text-muted-foreground mt-1 h-8 justify-start text-xs underline"
                >
                  Clear filter
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Table area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ProblemFilter
            search={search}
            level={level}
            totalFiltered={filtered.length}
            onSearchChange={handleSearch}
            onLevelChange={handleLevel}
          />
          <ProblemTable problems={filtered} page={page} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
