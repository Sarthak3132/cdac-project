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
  ProblemExampleForm,
  type ProblemExampleFormValues,
} from "./problem-example-form";

import type { ProblemExample } from "./types";
import { api } from "@/services/axios-interceptor";

interface UpdateProblemExampleDialogProps {
  example: ProblemExample;
  onUpdated: () => void;
}

export function UpdateProblemExampleDialog({
  example,
  onUpdated,
}: UpdateProblemExampleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: ProblemExampleFormValues) {
    setIsSubmitting(true);

    try {
      await api.put(`/problems/examples/${example.id}`, {
        inputData: values.inputData,
        outputData: values.outputData,
        explanation: values.explanation,
        displayOrder: Number(values.displayOrder),
      });

      toast.success("Problem example updated successfully");

      setOpen(false);
      onUpdated();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update problem example"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Problem Example</DialogTitle>

          <DialogDescription>
            Update the selected problem example.
          </DialogDescription>
        </DialogHeader>

        <ProblemExampleForm
          mode="update"
          initialValues={{
            inputData: example.inputData,
            outputData: example.outputData,
            explanation: example.explanation ?? "",
            displayOrder: String(example.displayOrder),
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}