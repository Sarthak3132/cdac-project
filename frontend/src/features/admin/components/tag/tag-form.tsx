import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TagFormValues {
  name: string;
}

interface TagFormProps {
  mode: "create" | "update";
  initialValues?: Partial<TagFormValues>;
  onSubmit: (values: TagFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: TagFormValues = {
  name: "",
};

export function TagForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: TagFormProps) {
  const [values, setValues] = useState<TagFormValues>({
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

    if (!values.name.trim()) {
      next.name = "Tag name is required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Tag Name</Label>

        <Input
          id="name"
          placeholder="e.g. Array"
          value={values.name}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />

        {errors.name && (
          <p className="text-destructive text-sm">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
            ? "Create Tag"
            : "Update Tag"}
        </Button>
      </div>
    </form>
  );
}