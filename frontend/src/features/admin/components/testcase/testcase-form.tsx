import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
export interface TestCaseFormValues {
  inputData: string;
  displayInput: string;
  expectedOutput: string;
  explanation: string;
  visible: boolean;
}

interface TestCaseFormProps {
  mode: "create" | "update";
  initialValues?: Partial<TestCaseFormValues>;
  onSubmit: (values: TestCaseFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: TestCaseFormValues = {
  inputData: "",
  displayInput: "",
  expectedOutput: "",
  explanation: "",
  visible: true,
};

export function TestCaseForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: TestCaseFormProps) {
  const [values, setValues] = useState<TestCaseFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!values.inputData.trim()) {
      next.inputData = "Input is required";
    }

    if (!values.expectedOutput.trim()) {
      next.expectedOutput = "Expected output is required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="inputData">Input Data</Label>

        <Textarea
          id="inputData"
          rows={5}
          value={values.inputData}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              inputData: e.target.value,
            }))
          }
          placeholder="Enter test case input..."
        />

        {errors.inputData && <p className="text-destructive text-sm">{errors.inputData}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayInput">Display Input</Label>

        <Textarea
          id="displayInput"
          rows={3}
          value={values.displayInput}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              displayInput: e.target.value,
            }))
          }
          placeholder="Optional display input shown to users..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation</Label>

        <Textarea
          id="explanation"
          rows={4}
          value={values.explanation}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              explanation: e.target.value,
            }))
          }
          placeholder="Optional explanation..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedOutput">Expected Output</Label>

        <Textarea
          id="expectedOutput"
          rows={5}
          value={values.expectedOutput}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              expectedOutput: e.target.value,
            }))
          }
          placeholder="Enter expected output..."
        />

        {errors.expectedOutput && (
          <p className="text-destructive text-sm">{errors.expectedOutput}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={values.visible}
          onCheckedChange={(checked) =>
            setValues((prev) => ({
              ...prev,
              visible: checked === true,
            }))
          }
        />

        <Label>Visible to Users</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {mode === "create" ? "Create Test Case" : "Update Test Case"}
        </Button>
      </div>
    </form>
  );
}
