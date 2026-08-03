import { useEffect, useState } from "react";
import { Trophy, Flame, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { StatsBar } from "@/features/problem-set/components/stats-bar";
import { ProblemFilter } from "@/features/problem-set/components/problem-filter";
import { ProblemTable } from "@/features/problem-set/components/problem-table";

import type { ProblemSummary } from "@/types/probelm-set";
import { api } from "@/services/axios-interceptor";

const PAGE_SIZE = 10;

type Tags = {
  id: number;
  name: string;
};

export default function ProblemSet() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [tags, setTags] = useState<Tags[]>([]);

  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const getProblems = async (
    page: number,
    size: number,
    search: string,
    difficulty?: string,
    tag?: string | null,
  ) => {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (search.trim()) {
      params.search = search;
    }

    if (difficulty && difficulty !== "All") {
      params.difficulty = difficulty.toUpperCase();
    }

    if (tag && tag.trim()) {
      params.tag = tag;
    }

    const res = await api.get<any>("/problems", {
      params,
    });

    return res.data.data;
  };
  const fetchProblems = async () => {
    setLoading(true);

    try {
      const data = await getProblems(
        page - 1, // Spring uses 0-based pages
        PAGE_SIZE,
        search,
        level,
        activeTag,
      );

      setProblems(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    const res = await api.get("/tags");
    setTags(res.data.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [page, search, level, activeTag]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleLevel = (value: string) => {
    setLevel(value);
    setPage(1);
  };

  const handleTags = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setPage(1);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <StatsBar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="border-border bg-muted/20 hidden w-52 shrink-0 flex-col gap-4 border-r p-4 md:flex">
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

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Tags
            </p>

            <div className="flex flex-col gap-1">
              {tags.length > 0 &&
                tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={activeTag === tag.name ? "default" : "ghost"}
                    size="sm"
                    className="h-8 justify-start text-sm font-normal"
                    onClick={() => handleTags(tag.name)}
                  >
                    {tag.name}
                  </Button>
                ))}

              {activeTag && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground mt-2 h-8 justify-start text-xs underline"
                  onClick={() => setActiveTag(null)}
                >
                  Clear filter
                </Button>
              )}
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ProblemFilter
            search={search}
            level={level}
            totalFiltered={totalElements}
            onSearchChange={handleSearch}
            onLevelChange={handleLevel}
          />

          <ProblemTable
            problems={problems}
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
