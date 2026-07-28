import { useCallback, useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

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

import type { ProblemExample } from
  "@/features/admin/components/problem-example/types";

import { CreateProblemExampleDialog } from
  "@/features/admin/components/problem-example/problem-example-create";

import { UpdateProblemExampleDialog } from
  "@/features/admin/components/problem-example/problem-example-update";

import { DeleteProblemExampleDialog } from
  "@/features/admin/components/problem-example/problem-example-delete";

interface Problem {
  id: number;
  title: string;
}

function ProblemExamples() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [examples, setExamples] = useState<ProblemExample[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedProblem, setSelectedProblem] =
    useState<Problem | null>(null);

  const [open, setOpen] = useState(false);

  const fetchProblems = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/problems");

      setProblems(res.data.data.content || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExamples = async (problemId: number) => {
    try {
      const res = await api.get(
        `/problems/${problemId}/examples`
      );

      setExamples(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const openExamples = async (problem: Problem) => {
    setSelectedProblem(problem);

    await fetchExamples(problem.id);

    setOpen(true);
  };

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Problem Examples
        </h1>

        <p className="text-muted-foreground text-sm">
          Manage examples for problems.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>{problem.id}</TableCell>

                  <TableCell>
                    {problem.title}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() =>
                        openExamples(problem)
                      }
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Examples
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Examples - {selectedProblem?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProblem && (
            <>
              <div className="flex justify-end">
                <CreateProblemExampleDialog
                  problemId={selectedProblem.id}
                  onCreated={() =>
                    fetchExamples(selectedProblem.id)
                  }
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Explanation</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {examples.map((example) => (
                    <TableRow key={example.id}>
                      <TableCell>
                        {example.displayOrder}
                      </TableCell>

                      <TableCell>
                        {example.inputData}
                      </TableCell>

                      <TableCell>
                        {example.outputData}
                      </TableCell>

                      <TableCell>
                        {example.explanation}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <UpdateProblemExampleDialog
                            example={example}
                            onUpdated={() =>
                              fetchExamples(
                                selectedProblem.id
                              )
                            }
                          />

                          <DeleteProblemExampleDialog
                            exampleId={example.id}
                            onDeleted={() =>
                              fetchExamples(
                                selectedProblem.id
                              )
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProblemExamples;