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
  HintForm,
  type HintFormValues,
} from "./hint-form";

import type { Hint } from "./types";

import { api } from "@/services/axios-interceptor";

interface UpdateHintDialogProps {
  hint: Hint;
  onUpdated?: () => void;
  trigger?: React.ReactNode;
}

export function UpdateHintDialog({
  hint,
  onUpdated,
  trigger,
}: UpdateHintDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    values: HintFormValues
  ) => {
    setIsSubmitting(true);

    try {
      await api.put(
        `/problems/hints/${hint.id}`,
        {
          content: values.content,
          displayOrder: Number(
            values.displayOrder
          ),
        }
      );

      toast.success(
        "Hint updated successfully."
      );

      setOpen(false);

      onUpdated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update hint."
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
          <Button
            variant="ghost"
            size="icon"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Update Hint
          </DialogTitle>

          <DialogDescription>
            Update the selected hint.
          </DialogDescription>
        </DialogHeader>

        <HintForm
          mode="update"
          initialValues={{
            content: hint.content,
            displayOrder: String(
              hint.displayOrder
            ),
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}