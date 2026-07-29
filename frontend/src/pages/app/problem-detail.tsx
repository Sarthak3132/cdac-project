import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";

import { ProblemPanel } from "@/features/problem-detail/components/problem-panel";
import { EditorPanel } from "@/features/problem-detail/components/editor-panel";
import { TestCasePanel } from "@/features/problem-detail/components/test-case-panel";
import { OutputPanel } from "@/features/problem-detail/components/output-panel";
import { api } from "@/services/axios-interceptor";
import { cn } from "@/lib/utils";

import type {
  ProblemDetails,
  ProblemExample,
  TestCase,
  Language,
  ProblemHints,
} from "@/types/problem-detail";

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();

  const [customInput, setCustomInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [examples, setExamples] = useState<ProblemExample[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hints, setHints] = useState<ProblemHints[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [problemRes, exampleRes, testCaseRes, languageRes, hintsRes] = await Promise.all([
          api.get(`/problems/${id}`),
          api.get(`/problems/${id}/examples`),
          api.get(`/problems/${id}/testcases`),
          api.get("/languages"),
          api.get(`/problems/${id}/hints`),
        ]);

        setProblem(problemRes.data.data);
        setExamples(exampleRes.data.data ?? []);
        setTestCases(testCaseRes.data.data ?? []);
        setHints(hintsRes.data.data ?? []);
        setLanguages(languageRes.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load problem.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <ProblemSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!problem) {
    return null;
  }

  return (
    <div className="bg-background flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="hidden flex-1 overflow-hidden md:flex">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={65}>
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={40}>
                <div className="border-border h-full border-r">
                  <ProblemPanel problem={problem} examples={examples} hints={hints} />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={60}>
                <EditorPanel problemId={problem.id} languages={languages} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={35}>
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={50}>
                <div className="border-border h-full border-r">
                  <TestCasePanel
                    testCases={testCases}
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50}>
                {/* problemId={problem.id} */}
                <OutputPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <MobileView
          problem={problem}
          examples={examples}
          testCases={testCases}
          languages={languages}
          hints={hints}
        />
      </div>
    </div>
  );
}

function MobileView({
  problem,
  examples,
  testCases,
  languages,
  hints,
}: {
  problem: ProblemDetails;
  examples: ProblemExample[];
  testCases: TestCase[];
  languages: Language[];
  hints: ProblemHints[];
}) {
  const tabs = ["Problem", "Editor", "Test Cases", "Output"] as const;

  const [active, setActive] = useState<(typeof tabs)[number]>("Problem");
  const [customInput, setCustomInput] = useState("");

  return (
    <>
      <div className="border-border flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium",
              active === tab ? "border-primary" : "text-muted-foreground border-transparent",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {active === "Problem" && (
          <ProblemPanel problem={problem} examples={examples} hints={hints} />
        )}
        {active === "Editor" && <EditorPanel problemId={problem.id} languages={languages} />}
        {active === "Test Cases" && (
          <TestCasePanel
            testCases={testCases}
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
        )}
        {/* problemId={problem.id} */}
        {active === "Output" && <OutputPanel />}
      </div>
    </>
  );
}

function ProblemSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="flex-1 p-4">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
