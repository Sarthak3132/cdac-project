import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  
  const fetchProblems = useCallback(async () => {
  setLoadingProblems(true);

  try {
    const res = await api.get("/problems", {
      params: {
        page,
        size,
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
}, [page, size, search]);

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
    const timeout = setTimeout(fetchProblems, 300);
    return () => clearTimeout(timeout);
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

          <div className="relative mt-4">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

  <Input
    className="pl-8"
    placeholder="Search problems..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(0);
    }}
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

        <div className="flex items-center justify-between border-t p-4">
  <p className="text-muted-foreground text-sm">
    Total Problems: {totalElements}
  </p>

  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 0}
      onClick={() => setPage((prev) => prev - 1)}
    >
      Previous
    </Button>

    <span className="text-sm">
      Page {page + 1} of {Math.max(totalPages, 1)}
    </span>

    <Button
      variant="outline"
      size="sm"
      disabled={page + 1 >= totalPages}
      onClick={() => setPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
</div>
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
    <TableHead>Display Input</TableHead>
    <TableHead>Expected Output</TableHead>
    <TableHead>Explanation</TableHead>
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
          <Skeleton className="h-4 w-full" />
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
        className="py-8 text-center text-muted-foreground"
      >
        No test cases found.
      </TableCell>
    </TableRow>
  ) : (
    testCases.map((testCase) => (
      <TableRow key={testCase.id}>
        <TableCell className="max-w-xs whitespace-pre-wrap break-words">
  {testCase.inputData || "-"}
</TableCell>

<TableCell className="max-w-xs whitespace-pre-wrap break-words">
  {testCase.expectedOutput}
</TableCell>

<TableCell className="max-w-xs whitespace-pre-wrap break-words">
  {testCase.explanation || "-"}
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