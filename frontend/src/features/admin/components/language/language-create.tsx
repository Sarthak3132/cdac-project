import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  LanguageForm,
  type LanguageFormValues,
} from "./language-form";

import { api } from "@/services/axios-interceptor";

interface CreateLanguageDialogProps {
  onCreated?: () => void;
  trigger?: React.ReactNode;
}

export function CreateLanguageDialog({
  onCreated,
  trigger,
}: CreateLanguageDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LanguageFormValues) => {
    setIsSubmitting(true);

    try {
      await api.post("/languages", {
  name: values.name,
  shortName: values.shortName,
  fileExtension: values.fileExtension,
  version: values.version,
  judge0LanguageId: Number(values.judge0LanguageId),
  enabled: values.enabled,
});

      toast.success("Language created successfully");

      setOpen(false);
      onCreated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to create language"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Language
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Language</DialogTitle>

          <DialogDescription>
            Add a new programming language to the platform.
          </DialogDescription>
        </DialogHeader>

        <LanguageForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}