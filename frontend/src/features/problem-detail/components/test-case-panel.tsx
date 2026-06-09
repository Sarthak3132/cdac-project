// components/problem/TestCasePanel.tsx
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setCustomInput, setUseCustomInput } from "@/features/problem-detail/slice/problemSlice";
import type { RootState } from "@/app/store";
import type { TestCase } from "@/types/problem-detail";

export function TestCasePanel({ testCases }: { testCases: TestCase[] }) {
  const dispatch = useDispatch();
  const { customInput, useCustomInput } = useSelector((state: RootState) => state.problem);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 items-center justify-between border-b px-4">
        <span className="text-sm font-medium">Test Cases</span>
        <div className="flex items-center gap-2">
          <Label htmlFor="custom-toggle" className="text-muted-foreground text-xs">
            Custom Input
          </Label>
          <Switch
            id="custom-toggle"
            checked={useCustomInput}
            onCheckedChange={(val) => dispatch(setUseCustomInput(val))}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {useCustomInput ? (
          <div className="flex h-full flex-col gap-2 p-3">
            <Label className="text-muted-foreground text-xs">Custom Input</Label>
            <Textarea
              className="flex-1 resize-none font-mono text-xs"
              placeholder="Enter your custom input here..."
              value={customInput}
              onChange={(e) => dispatch(setCustomInput(e.target.value))}
            />
          </div>
        ) : (
          <Tabs defaultValue={testCases[0]?.id} className="flex h-full flex-col">
            <div className="border-border border-b px-3">
              <TabsList className="h-9 gap-1 bg-transparent p-0">
                {testCases.map((tc, i) => (
                  <TabsTrigger
                    key={tc.id}
                    value={tc.id}
                    className="data-[state=active]:border-primary h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs data-[state=active]:shadow-none"
                  >
                    Case {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <ScrollArea className="flex-1">
              {testCases.map((tc) => (
                <TabsContent key={tc.id} value={tc.id} className="mt-0 space-y-3 p-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">Input</p>
                    <pre className="bg-muted rounded-md p-2 font-mono text-xs whitespace-pre-wrap">
                      {tc.input}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">Expected Output</p>
                    <pre className="bg-muted rounded-md p-2 font-mono text-xs whitespace-pre-wrap">
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
