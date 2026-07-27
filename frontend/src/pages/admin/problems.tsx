// pages/admin/problems/index.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteProblemDialog } from "@/features/admin/components/problem-delete";
import { api } from "@/services/axios-interceptor";

interface Problem {
  id: string;
  title: string;
  problemDifficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  createdAt: string;
}

const difficultyColor: Record<Problem["problemDifficulty"], string> = {
  EASY: "bg-green-500/10 text-green-600 dark:text-green-400",
  MEDIUM: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  HARD: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/problems");
      console.log("Fetched problems:", res.data.data.content); // Log the response data
      setProblems(res.data.data.content);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchProblems, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchProblems]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Problems</h1>
          <p className="text-muted-foreground text-sm">
            Manage coding problems, difficulty, and tags.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/problems/create")} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Create Problem
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : problems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  No problems found.
                </TableCell>
              </TableRow>
            ) : (
              problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={difficultyColor[problem.problemDifficulty]}>
                      {problem.problemDifficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/problems/update/${problem.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteProblemDialog
                        problemId={problem.id}
                        problemTitle={problem.title}
                        onDeleted={fetchProblems}
                        trigger={
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" /> {/* placeholder, use Trash2 */}
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Problems;
