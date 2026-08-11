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
  HintForm,
  type HintFormValues,
} from "./hint-form";

import { api } from "@/services/axios-interceptor";

interface CreateHintDialogProps {
  problemId: number;
  onCreated?: () => void;
  trigger?: React.ReactNode;
}

export function CreateHintDialog({
  problemId,
  onCreated,
  trigger,
}: CreateHintDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    values: HintFormValues
  ) => {
    setIsSubmitting(true);

    try {
      await api.post(
        `/problems/${problemId}/hints`,
        {
          content: values.content,
          displayOrder: Number(
            values.displayOrder
          ),
        }
      );

      toast.success(
        "Hint created successfully."
      );

      setOpen(false);

      onCreated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to create hint."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Hint
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Create Hint
          </DialogTitle>

          <DialogDescription>
            Add a new hint for this problem.
          </DialogDescription>
        </DialogHeader>

        <HintForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}