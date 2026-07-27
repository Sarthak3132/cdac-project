// features/admin/problems/DeleteProblemDialog.tsx
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // or your toast lib of choice

interface DeleteProblemDialogProps {
  problemId: string;
  problemTitle: string;
  onDeleted?: () => void; // e.g. refetch list
  trigger?: React.ReactNode; // optional custom trigger (e.g. an icon button in a table row)
}

export function DeleteProblemDialog({
  problemId,
  problemTitle,
  onDeleted,
  trigger,
}: DeleteProblemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/problems/${problemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete problem");

      toast.success(`"${problemTitle}" deleted successfully`);
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      toast.error("Something went wrong while deleting the problem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete Problem
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this problem?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="text-foreground font-medium">"{problemTitle}"</span> along with its
            test cases, examples, and hints. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // prevent auto-close before async call finishes
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
