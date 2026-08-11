import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LanguageFormValues {
  name: string;
  shortName: string;
  fileExtension: string;
  version: string;
  judge0LanguageId: string;
  enabled: boolean;
}
interface LanguageFormProps {
  mode: "create" | "update";
  initialValues?: Partial<LanguageFormValues>;
  onSubmit: (values: LanguageFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: LanguageFormValues = {
  name: "",
  shortName: "",
  fileExtension: "",
  version: "",
  judge0LanguageId: "",
  enabled: true,
};

export function LanguageForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: LanguageFormProps) {
  const [values, setValues] = useState<LanguageFormValues>({
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

  if (!values.name.trim())
    next.name = "Name is required";

  if (!values.shortName.trim())
    next.shortName = "Short name is required";

  if (!values.fileExtension.trim())
    next.fileExtension = "File extension is required";

  if (!values.version.trim())
    next.version = "Version is required";

  if (!values.judge0LanguageId.trim())
    next.judge0LanguageId = "Judge0 Language ID is required";

  setErrors(next);

  return Object.keys(next).length === 0;
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={values.name}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="Java"
        />
        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Version</Label>
        <Input
          value={values.version}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              version: e.target.value,
            }))
          }
          placeholder="21"
        />
        {errors.version && (
          <p className="text-sm text-destructive">
            {errors.version}
          </p>
        )}
      </div>

        <div className="space-y-2">
  <Label>Short Name</Label>

  <Input
    value={values.shortName}
    onChange={(e) =>
      setValues((prev) => ({
        ...prev,
        shortName: e.target.value,
      }))
    }
    placeholder="java"
  />

  {errors.shortName && (
    <p className="text-sm text-destructive">
      {errors.shortName}
    </p>
  )}
</div>

<div className="space-y-2">
  <Label>File Extension</Label>

  <Input
    value={values.fileExtension}
    onChange={(e) =>
      setValues((prev) => ({
        ...prev,
        fileExtension: e.target.value,
      }))
    }
    placeholder=".java"
  />

  {errors.fileExtension && (
    <p className="text-sm text-destructive">
      {errors.fileExtension}
    </p>
  )}
</div>
      

      
<div className="space-y-2">
  <Label>Judge0 Language ID</Label>

  <Input
    type="number"
    value={values.judge0LanguageId}
    onChange={(e) =>
      setValues((prev) => ({
        ...prev,
        judge0LanguageId: e.target.value,
      }))
    }
    placeholder="62"
  />

  {errors.judge0LanguageId && (
    <p className="text-sm text-destructive">
      {errors.judge0LanguageId}
    </p>
  )}
</div>
      

      

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={values.enabled}
            onCheckedChange={(checked) =>
              setValues((prev) => ({
                ...prev,
                enabled: checked === true,
              }))
            }
          />
          <Label>Enabled</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {mode === "create"
            ? "Create Language"
            : "Update Language"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}