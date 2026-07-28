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
  TestCaseForm,
  type TestCaseFormValues,
} from "./testcase-form";

import { api } from "@/services/axios-interceptor";
import type { TestCase } from "./types";

interface UpdateTestCaseDialogProps {
  testCase: TestCase;
  onUpdated: () => void;
}

export function UpdateTestCaseDialog({
  testCase,
  onUpdated,
}: UpdateTestCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TestCaseFormValues) => {
    setIsSubmitting(true);

    try {
      await api.put(`/problems/testcases/${testCase.id}`, {
        inputData: values.inputData,
        expectedOutput: values.expectedOutput,
      });

      toast.success("Test case updated successfully");

      setOpen(false);
      onUpdated();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update test case"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Test Case</DialogTitle>
          <DialogDescription>
            Update the input and expected output.
          </DialogDescription>
        </DialogHeader>

        <TestCaseForm
          mode="update"
          initialValues={{
            inputData: testCase.inputData,
            expectedOutput: testCase.expectedOutput,
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}