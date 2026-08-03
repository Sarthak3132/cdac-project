// features/admin/components/problem-example/problem-example-form.tsx
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ProblemExampleFormValues {
  inputData: string;
  outputData: string;
  explanation: string;
  displayOrder: string;
}

interface ProblemExampleFormProps {
  mode: "create" | "update";
  initialValues?: Partial<ProblemExampleFormValues>;
  onSubmit: (values: ProblemExampleFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: ProblemExampleFormValues = {
  inputData: "",
  outputData: "",
  explanation: "",
  displayOrder: "1",
};

export function ProblemExampleForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: ProblemExampleFormProps) {
  const [values, setValues] = useState<ProblemExampleFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate the form once the parent has the example to edit.
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.inputData.trim()) next.inputData = "Input is required";
    if (!values.outputData.trim()) next.outputData = "Output is required";
    if (values.displayOrder === "" || Number.isNaN(Number(values.displayOrder)))
      next.displayOrder = "Display order is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inputData">Input</Label>
        <Textarea
          id="inputData"
          rows={4}
          value={values.inputData}
          onChange={(e) => setValues((prev) => ({ ...prev, inputData: e.target.value }))}
          placeholder="e.g. nums = [2,7,11,15], target = 9"
        />
        {errors.inputData && <p className="text-destructive text-sm">{errors.inputData}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="outputData">Output</Label>
        <Textarea
          id="outputData"
          rows={3}
          value={values.outputData}
          onChange={(e) => setValues((prev) => ({ ...prev, outputData: e.target.value }))}
          placeholder="e.g. [0,1]"
        />
        {errors.outputData && <p className="text-destructive text-sm">{errors.outputData}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (optional)</Label>
        <Textarea
          id="explanation"
          rows={3}
          value={values.explanation}
          onChange={(e) => setValues((prev) => ({ ...prev, explanation: e.target.value }))}
          placeholder="Why this output is correct..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Display order</Label>
        <Input
          id="displayOrder"
          type="number"
          min={1}
          value={values.displayOrder}
          onChange={(e) => setValues((prev) => ({ ...prev, displayOrder: e.target.value }))}
        />
        {errors.displayOrder && (
          <p className="text-destructive text-sm">{errors.displayOrder}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add Example" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}