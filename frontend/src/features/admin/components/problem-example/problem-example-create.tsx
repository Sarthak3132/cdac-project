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
  ProblemExampleForm,
  type ProblemExampleFormValues,
} from "./problem-example-form";

import { api } from "@/services/axios-interceptor";

interface CreateProblemExampleDialogProps {
  problemId: number;
  onCreated: () => void;
}

export function CreateProblemExampleDialog({
  problemId,
  onCreated,
}: CreateProblemExampleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: ProblemExampleFormValues) {
    setIsSubmitting(true);

    try {
      await api.post(`/problems/${problemId}/examples`, {
        inputData: values.inputData,
        outputData: values.outputData,
        explanation: values.explanation,
        displayOrder: Number(values.displayOrder),
      });

      toast.success("Problem example created successfully");

      setOpen(false);
      onCreated();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to create problem example"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Example
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Problem Example</DialogTitle>

          <DialogDescription>
            Add a new example for this problem.
          </DialogDescription>
        </DialogHeader>

        <ProblemExampleForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}