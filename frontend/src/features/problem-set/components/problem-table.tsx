import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ProblemTableProps } from "@/types/probelm-set";

const LEVEL_COLOR: Record<string, string> = {
  EASY: "text-green-600 font-medium",
  MEDIUM: "text-yellow-600 font-medium",
  HARD: "text-red-600 font-medium",
};

export function ProblemTable({
  problems,
  page,
  totalPages,
  loading,
  onPageChange,
}: ProblemTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (problems.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="font-medium">No problems found</p>
        <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-28">Difficulty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {problems.map((problem) => {
              return (
                <TableRow
                  key={problem.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/app/problems/${problem.id}`)}
                >
                  <TableCell className="text-muted-foreground text-xs">{problem.id}</TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{problem.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {problem.description.length > 80
                          ? `${problem.description.substring(0, 80)}...`
                          : problem.description}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className={LEVEL_COLOR[problem.problemDifficulty] ?? ""}>
                    {problem.problemDifficulty}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-border flex items-center justify-center gap-1 border-t px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={page === index + 1 ? "default" : "outline"}
              size="sm"
              className="h-7 min-w-7 px-2 text-xs"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </>
  );
}
