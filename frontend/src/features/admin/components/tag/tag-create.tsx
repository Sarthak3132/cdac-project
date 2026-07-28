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
  TagForm,
  type TagFormValues,
} from "./tag-form";

import { api } from "@/services/axios-interceptor";

interface CreateTagDialogProps {
  onCreated?: () => void;
  trigger?: React.ReactNode;
}

export function CreateTagDialog({
  onCreated,
  trigger,
}: CreateTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TagFormValues) => {
    setIsSubmitting(true);

    try {
      await api.post("/tags", {
        name: values.name,
      });

      toast.success("Tag created successfully");

      setOpen(false);

      onCreated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to create tag"
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
            Create Tag
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>

          <DialogDescription>
            Add a new tag to categorize coding problems.
          </DialogDescription>
        </DialogHeader>

        <TagForm
          mode="create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}