// features/admin/tabs/ProblemsTab.tsx
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_PROBLEMS } from "../data/dummy-admin-data";

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600",
};

export function ProblemsTab() {
  const [search, setSearch] = useState("");

  const filtered = ADMIN_PROBLEMS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Problems</h2>
          <p className="text-muted-foreground text-sm">{ADMIN_PROBLEMS.length} total problems</p>
        </div>
        <Button size="sm" className="h-8 text-xs">
          Add Problem
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pr-8 pl-9 text-xs"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="border-border overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-border border-b">
              <tr>
                {[
                  "#",
                  "Title",
                  "Difficulty",
                  "Tags",
                  "Submissions",
                  "Acceptance",
                  "Status",
                  "",
                ].map((h) => (
                  <th key={h} className="text-muted-foreground p-3 text-left text-xs font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-muted-foreground p-3 text-xs">{p.id}</td>
                  <td className="p-3 text-xs font-medium">{p.title}</td>
                  <td className={`p-3 text-xs font-medium ${DIFFICULTY_STYLE[p.difficulty]}`}>
                    {p.difficulty}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="px-1.5 py-0 text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="text-muted-foreground p-3 text-xs">
                    {p.submissions.toLocaleString()}
                  </td>
                  <td className="p-3 text-xs">{p.acceptanceRate}%</td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        p.status === "published"
                          ? "border-green-500/20 bg-green-500/10 text-green-700"
                          : "border-yellow-500/20 bg-yellow-500/10 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
