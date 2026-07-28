import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LanguageFormValues {
  name: string;
  version: string;
  dockerImage: string;
  sourceFile: string;
  compileCommand: string;
  runCommand: string;
  isCompiled: boolean;
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
  version: "",
  dockerImage: "",
  sourceFile: "",
  compileCommand: "",
  runCommand: "",
  isCompiled: false,
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

    if (!values.version.trim())
      next.version = "Version is required";

    if (!values.dockerImage.trim())
      next.dockerImage = "Docker image is required";

    if (!values.sourceFile.trim())
      next.sourceFile = "Source file is required";

    if (!values.runCommand.trim())
      next.runCommand = "Run command is required";

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
        <Label>Docker Image</Label>
        <Input
          value={values.dockerImage}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              dockerImage: e.target.value,
            }))
          }
          placeholder="openjdk:21"
        />
        {errors.dockerImage && (
          <p className="text-sm text-destructive">
            {errors.dockerImage}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Source File</Label>
        <Input
          value={values.sourceFile}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              sourceFile: e.target.value,
            }))
          }
          placeholder="Main.java"
        />
        {errors.sourceFile && (
          <p className="text-sm text-destructive">
            {errors.sourceFile}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Compile Command</Label>
        <Input
          value={values.compileCommand}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              compileCommand: e.target.value,
            }))
          }
          placeholder="javac Main.java"
        />
      </div>

      <div className="space-y-2">
        <Label>Run Command</Label>
        <Input
          value={values.runCommand}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              runCommand: e.target.value,
            }))
          }
          placeholder="java Main"
        />
        {errors.runCommand && (
          <p className="text-sm text-destructive">
            {errors.runCommand}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={values.isCompiled}
            onCheckedChange={(checked) =>
              setValues((prev) => ({
                ...prev,
                isCompiled: checked === true,
              }))
            }
          />
          <Label>Compiled Language</Label>
        </div>

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