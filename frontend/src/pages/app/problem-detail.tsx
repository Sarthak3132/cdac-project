// pages/ProblemDetailsPage.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblem } from "@/features/problem-detail/slice/problemSlice";
import type { RootState, AppDispatch } from "@/app/store";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemPanel } from "@/features/problem-detail/components/problem-panel";
import { EditorPanel } from "@/features/problem-detail/components/editor-panel";
import { TestCasePanel } from "@/features/problem-detail/components/test-case-panel";
import { OutputPanel } from "@/features/problem-detail/components/output-panel";

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { problem, loading, error } = useSelector((state: RootState) => state.problem);

  useEffect(() => {
    if (id) dispatch(fetchProblem(id));
  }, [id, dispatch]);

  if (loading) return <ProblemSkeleton />;
  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  if (!problem) return null;

  return (
    <div className="bg-background flex h-[calc(100vh-3.5rem)] flex-col">
      {/* ── Desktop: Resizable Split Layout ── */}
      <div className="hidden flex-1 overflow-hidden md:flex">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          {/* Top row */}
          <ResizablePanel defaultSize={65} minSize={40}>
            <ResizablePanelGroup orientation="horizontal">
              {/* Problem pane */}
              <ResizablePanel defaultSize={40} minSize={28}>
                <div className="border-border h-full border-r">
                  <ProblemPanel problem={problem} />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Editor pane */}
              <ResizablePanel defaultSize={60} minSize={35}>
                <EditorPanel problemId={problem.id} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Bottom row */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <ResizablePanelGroup orientation="horizontal">
              {/* Test cases */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="border-border h-full border-r">
                  <TestCasePanel testCases={problem.testCases} />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Output */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <OutputPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ── Mobile: Tabbed Stack ── */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <MobileView problem={problem} />
      </div>
    </div>
  );
}

// Mobile tabbed layout
import { useState } from "react";
import type { Problem } from "@/types/problem-detail";

function MobileView({ problem }: { problem: Problem }) {
  const tabs = ["Problem", "Editor", "Test Cases", "Output"] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>("Problem");

  return (
    <>
      <div className="border-border flex shrink-0 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
              active === tab
                ? "border-primary text-foreground"
                : "text-muted-foreground border-transparent",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {active === "Problem" && <ProblemPanel problem={problem} />}
        {active === "Editor" && <EditorPanel problemId={problem.id} />}
        {active === "Test Cases" && <TestCasePanel testCases={problem.testCases} />}
        {active === "Output" && <OutputPanel />}
      </div>
    </>
  );
}

import { cn } from "@/lib/utils";

function ProblemSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-0">
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="flex-1 p-4">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
