import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export interface HintFormValues {
  content: string;
  displayOrder: string;
}

interface HintFormProps {
  mode: "create" | "update";
  initialValues?: Partial<HintFormValues>;
  onSubmit: (values: HintFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_VALUES: HintFormValues = {
  content: "",
  displayOrder: "1",
};

export function HintForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: HintFormProps) {
  const [values, setValues] = useState<HintFormValues>({
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
    const newErrors: Record<string, string> = {};

    if (!values.content.trim()) {
      newErrors.content = "Hint content is required.";
    }

    if (
      values.displayOrder.trim() === "" ||
      Number.isNaN(Number(values.displayOrder))
    ) {
      newErrors.displayOrder = "Display order is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="content">
          Hint Content
        </Label>

        <Textarea
          id="content"
          rows={5}
          value={values.content}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
          placeholder="Enter hint..."
        />

        {errors.content && (
          <p className="text-sm text-destructive">
            {errors.content}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">
          Display Order
        </Label>

        <Input
          id="displayOrder"
          type="number"
          min={1}
          value={values.displayOrder}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              displayOrder: e.target.value,
            }))
          }
        />

        {errors.displayOrder && (
          <p className="text-sm text-destructive">
            {errors.displayOrder}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {mode === "create"
            ? "Create Hint"
            : "Update Hint"}
        </Button>
      </div>
    </form>
  );
}