// components/problem/ProblemPanel.tsx
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Problem, Difficulty } from "@/types/problem-detail";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-600 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ProblemPanel({ problem }: { problem: Problem }) {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="problem" className="flex h-full flex-col">
        <div className="border-border border-b px-4">
          <TabsList className="h-11 gap-1 bg-transparent p-0">
            {["problem", "hints"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent bg-transparent px-3 pt-2 pb-2 capitalize data-[state=active]:shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Problem Tab */}
        <TabsContent value="problem" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-5 p-4">
              {/* Title + Difficulty */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold">{problem.title}</h1>
                  <Badge className={DIFFICULTY_STYLES[problem.difficulty]} variant="outline">
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Statement */}
              <div className="bg-muted/30 text-muted-foreground rounded-lg p-3 text-sm leading-relaxed">
                <p>{problem.statement}</p>
              </div>

              {/* Input / Output Format */}
              <div className="space-y-3">
                <Section title="Input Format">
                  <p className="text-muted-foreground text-sm">{problem.inputFormat}</p>
                </Section>
                <Section title="Output Format">
                  <p className="text-muted-foreground text-sm">{problem.outputFormat}</p>
                </Section>
              </div>
              <Separator />

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="border-border overflow-hidden rounded-lg border">
                    <div className="bg-muted/50 px-3 py-1.5 text-xs font-medium">
                      Example {i + 1}
                    </div>
                    <div className="divide-border grid grid-cols-2 divide-x">
                      <div className="space-y-1 p-3">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          Input
                        </p>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{ex.input}</pre>
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          Output
                        </p>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{ex.output}</pre>
                      </div>
                    </div>
                    {ex.explanation && (
                      <div className="border-border border-t px-3 py-2">
                        <p className="text-muted-foreground text-xs">
                          <span className="text-foreground font-medium">Explanation: </span>
                          {ex.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Constraints */}
              <Section title="Constraints">
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="text-muted-foreground font-mono text-xs">
                      • {c}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Hints Tab */}
        <TabsContent value="hints" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-4">
              {problem.hints.map((hint, i) => (
                <div key={i} className="border-border rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">Hint {i + 1}</p>
                  <p className="text-sm">{hint}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}
