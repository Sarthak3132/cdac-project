import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { TestCase } from "@/types/problem-detail";

export function TestCasePanel({
  testCases,
  customInput,
  setCustomInput,
}: {
  testCases: TestCase[];
  customInput: string;
  setCustomInput: (input: string) => void;
}) {
  const [useCustomInput, setUseCustomInput] = useState(false);
  console.log(testCases);

  if (testCases.length === 0 && !useCustomInput) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">No test cases available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border flex h-10 items-center justify-between border-b px-4">
        <span className="text-sm font-medium">Test Cases</span>

        <div className="flex items-center gap-2">
          <Label htmlFor="custom-toggle" className="text-muted-foreground text-xs">
            Custom Input
          </Label>

          <Switch id="custom-toggle" checked={useCustomInput} onCheckedChange={setUseCustomInput} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {useCustomInput ? (
          <div className="flex h-full flex-col gap-2 p-3">
            <Label className="text-muted-foreground text-xs">Custom Input</Label>

            <Textarea
              className="flex-1 resize-none font-mono text-xs"
              placeholder="Enter custom input..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </div>
        ) : (
          <Tabs defaultValue={testCases[0]?.id.toString()} className="flex h-full flex-col">
            <div className="border-border border-b px-3">
              <TabsList className="h-9 gap-1 bg-transparent p-0">
                {testCases.map((tc, index) => (
                  <TabsTrigger
                    key={tc.id}
                    value={tc.id.toString()}
                    className="data-[state=active]:border-primary h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:shadow-none"
                  >
                    Case {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              {testCases.map((tc) => (
                <TabsContent key={tc.id} value={tc.id.toString()} className="mt-0 space-y-4 p-3">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Input</p>

                    <pre className="bg-muted rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
                      {tc.inputData}
                    </pre>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">
                      Expected Output
                    </p>

                    <pre className="bg-muted rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        )}
      </div>
    </div>
  );
}
