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
  TagForm,
  type TagFormValues,
} from "./tag-form";

import type { Tag } from "./types";

import { api } from "@/services/axios-interceptor";

interface UpdateTagDialogProps {
  tag: Tag;
  onUpdated?: () => void;
  trigger?: React.ReactNode;
}

export function UpdateTagDialog({
  tag,
  onUpdated,
  trigger,
}: UpdateTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TagFormValues) => {
    setIsSubmitting(true);

    try {
      await api.put(`/tags/${tag.id}`, {
        name: values.name,
      });

      toast.success("Tag updated successfully");

      setOpen(false);

      onUpdated?.();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update tag"
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Tag</DialogTitle>

          <DialogDescription>
            Update the selected tag.
          </DialogDescription>
        </DialogHeader>

        <TagForm
          mode="update"
          initialValues={{
            name: tag.name,
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}