import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const DUMMY_SOLVED = new Set([1, 2, 5, 7, 9, 12, 14]);

const LEVEL_COLOR: Record<string, string> = {
  Easy: "text-green-600 font-medium",
  Medium: "text-yellow-600 font-medium",
  Hard: "text-red-600 font-medium",
};

const PER_PAGE = 10;

export function ProblemTable({ problems, page, onPageChange }: ProblemTableProps) {
  const navigate = useNavigate();

  const totalPages = Math.ceil(problems.length / PER_PAGE);
  const paginated = problems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (paginated.length === 0) {
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
              <TableHead className="w-10 text-center" />
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-24">Difficulty</TableHead>
              <TableHead className="hidden w-32 md:table-cell">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((problem) => {
              const solved = DUMMY_SOLVED.has(problem.id);
              return (
                <TableRow
                  key={problem.id}
                  onClick={() => navigate(`/app/problems/${problem.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell className="text-center">
                    {solved ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="text-muted-foreground/30 mx-auto h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{problem.id}</TableCell>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell className={`text-xs ${LEVEL_COLOR[problem.level] ?? ""}`}>
                    {problem.level}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-border flex shrink-0 items-center justify-center gap-1 border-t px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              className="h-7 min-w-7 px-2 text-xs"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </>
  );
}
