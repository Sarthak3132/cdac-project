import { useState } from "react";
import { Pencil } from "lucide-react";
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
} from "@/features/admin/components/language/language-form";
import { api } from "@/services/axios-interceptor";
import type { Language } from "@/features/admin/components/language/types";

interface UpdateLanguageDialogProps {
  language: Language;
  onUpdated?: () => void;
  trigger?: React.ReactNode;
}

export function UpdateLanguageDialog({
  language,
  onUpdated,
  trigger,
}: UpdateLanguageDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LanguageFormValues) => {
    setIsSubmitting(true);

    try {
      await api.put(`/languages/${language.id}`, {
  name: values.name,
  shortName: values.shortName,
  fileExtension: values.fileExtension,
  version: values.version,
  judge0LanguageId: Number(values.judge0LanguageId),
  enabled: values.enabled,
});

      toast.success("Language updated successfully");

      setOpen(false);
      onUpdated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update language"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Language</DialogTitle>
          <DialogDescription>
            Update language configuration.
          </DialogDescription>
        </DialogHeader>

        <LanguageForm
          mode="update"
          initialValues={{
            name: language.name,
            shortName: language.shortName,
            fileExtension: language.fileExtension,
            version: language.version,
            judge0LanguageId: language.judge0LanguageId.toString(),
            enabled: language.enabled,
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}