import { useCallback, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

import { api } from "@/services/axios-interceptor";

import { CreateTestCaseDialog } from "@/features/admin/components/testcase/testcase-create";
import { UpdateTestCaseDialog } from "@/features/admin/components/testcase/testcase-update";
import { DeleteTestCaseDialog } from "@/features/admin/components/testcase/testcase-delete";

import type { TestCase } from "@/features/admin/components/testcase/types";

interface Problem {
  id: number;
  title: string;
}

function Testcases() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingCases, setLoadingCases] = useState(false);

  const fetchProblems = useCallback(async () => {
    setLoadingProblems(true);

    try {
      const res = await api.get("/problems", {
        params: {
          page: 0,
          size: 100,
        },
      });

      setProblems(res.data.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProblems(false);
    }
  }, []);

  const fetchTestCases = useCallback(async (problemId: number) => {
    setLoadingCases(true);

    try {
      const res = await api.get(`/problems/${problemId}/testcases`);

      setTestCases(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setTestCases([]);
    } finally {
      setLoadingCases(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Left Side */}
      <div className="col-span-5 rounded-md border">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Problems</h2>
          <p className="text-muted-foreground text-sm">
            Select a problem to manage its test cases.
          </p>
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
            ) : (
              problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>{problem.title}</TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProblem(problem);
                        fetchTestCases(problem.id);
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
      </div>

      {/* Right Side */}
      <div className="col-span-7 rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedProblem
                ? selectedProblem.title
                : "Select a Problem"}
            </h2>

            <p className="text-muted-foreground text-sm">
              Manage test cases.
            </p>
          </div>

          {selectedProblem && (
            <CreateTestCaseDialog
              problemId={selectedProblem.id}
              onCreated={() => fetchTestCases(selectedProblem.id)}
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
                <TableHead>Input</TableHead>
                <TableHead>Expected Output</TableHead>
                <TableHead>Hidden</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingCases ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : testCases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No test cases found.
                  </TableCell>
                </TableRow>
              ) : (
                testCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell className="max-w-xs truncate font-mono">
                      {testCase.inputData}
                    </TableCell>

                    <TableCell className="max-w-xs truncate font-mono">
                      {testCase.expectedOutput}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          testCase.hidden
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {testCase.hidden ? "Yes" : "No"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <UpdateTestCaseDialog
                          testCase={testCase}
                          onUpdated={() =>
                            fetchTestCases(selectedProblem.id)
                          }
                        />

                        <DeleteTestCaseDialog
                          testCaseId={testCase.id}
                          onDeleted={() =>
                            fetchTestCases(selectedProblem.id)
                          }
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

export default Testcases;