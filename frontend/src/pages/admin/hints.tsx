// pages/admin/hints.tsx
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/services/axios-interceptor";

import { CreateHintDialog } from "@/features/admin/components/hint/hint-create";
import { UpdateHintDialog } from "@/features/admin/components/hint/hint-update";
import { DeleteHintDialog } from "@/features/admin/components/hint/hint-delete";

import type { Hint } from "@/features/admin/components/hint/types";

interface Problem {
  id: number;
  title: string;
}

const PROBLEM_PAGE_SIZE = 10;

function Hints() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [hints, setHints] = useState<Hint[]>([]);

  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingHints, setLoadingHints] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProblems = useCallback(async () => {
    setLoadingProblems(true);

    try {
      const res = await api.get("/problems", {
        params: {
          page,
          size: PROBLEM_PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data = res.data.data;

      setProblems(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProblems(false);
    }
  }, [page, search]);

  const fetchHints = useCallback(async (problemId: number) => {
    setLoadingHints(true);

    try {
      const res = await api.get(`/problems/${problemId}/hints`);

      const data: Hint[] = res.data.data ?? [];
      setHints([...data].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.error(err);
      setHints([]);
    } finally {
      setLoadingHints(false);
    }
  }, []);

  // Jump back to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchProblems, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchProblems]);

  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Left Side */}
      <div className="col-span-5 flex flex-col rounded-md border">
        <div className="space-y-3 border-b p-4">
          <div>
            <h2 className="text-xl font-semibold">Problems</h2>
            <p className="text-muted-foreground text-sm">
              Select a problem to manage its hints.
            </p>
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingProblems ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : problems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground py-8 text-center">
                  No problems found.
                </TableCell>
              </TableRow>
            ) : (
              problems.map((problem) => (
                <TableRow
                  key={problem.id}
                  className={selectedProblem?.id === problem.id ? "bg-muted/50" : undefined}
                >
                  <TableCell>{problem.title}</TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProblem(problem);
                        fetchHints(problem.id);
                      }}
                    >
                      <ChevronRight className="mr-1 h-4 w-4" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loadingProblems && totalPages > 0 && (
          <div className="mt-auto flex items-center justify-between border-t p-3">
            <p className="text-muted-foreground text-xs">
              Page {page + 1} of {totalPages} ({totalElements} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!canGoPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="col-span-7 rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedProblem ? selectedProblem.title : "Select a Problem"}
            </h2>

            <p className="text-muted-foreground text-sm">Manage hints.</p>
          </div>

          {selectedProblem && (
            <CreateHintDialog
              problemId={selectedProblem.id}
              onCreated={() => fetchHints(selectedProblem.id)}
            />
          )}
        </div>

        {!selectedProblem ? (
          <div className="text-muted-foreground p-10 text-center">
            Select a problem from the left.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Hint</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingHints ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : hints.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No hints found.
                  </TableCell>
                </TableRow>
              ) : (
                hints.map((hint) => (
                  <TableRow key={hint.id}>
                    <TableCell className="text-muted-foreground">
                      {hint.displayOrder}
                    </TableCell>

                    <TableCell className="max-w-md">{hint.content}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <UpdateHintDialog
                          hint={hint}
                          onUpdated={() => fetchHints(selectedProblem.id)}
                        />

                        <DeleteHintDialog
                          hintId={hint.id}
                          onDeleted={() => fetchHints(selectedProblem.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default Hints;