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
  TestCaseForm,
  type TestCaseFormValues,
} from "./testcase-form";

import { api } from "@/services/axios-interceptor";

interface CreateTestCaseDialogProps {
  problemId: number;
  onCreated: () => void;
}

export function CreateTestCaseDialog({
  problemId,
  onCreated,
}: CreateTestCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: TestCaseFormValues) {
    setIsSubmitting(true);

    try {
      await api.post(`/problems/${problemId}/testcases`, {
        inputData: values.inputData,
        expectedOutput: values.expectedOutput,
      });

      toast.success("Test case created successfully");

      setOpen(false);
      onCreated();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to create test case"
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
          Create Test Case
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Test Case</DialogTitle>

          <DialogDescription>
            Add a new test case for this problem.
          </DialogDescription>
        </DialogHeader>

        <TestCaseForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}