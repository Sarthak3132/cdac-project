// features/admin/components/user/user-delete-dialog.tsx
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { api } from "@/services/axios-interceptor";

interface DeleteUserDialogProps {
  userId: number;
  username: string;
  onDeleted?: () => void; // e.g. refetch the users list
  trigger?: React.ReactNode; // optional custom trigger
}

export function DeleteUserDialog({ userId, username, onDeleted, trigger }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success(`"${username}" deleted successfully`);
      setOpen(false);
      onDeleted?.();
    } catch (error: any) {
      console.error(error);
      // The backend rejects an admin deleting their own account, among other cases —
      // surface whatever message it returns instead of a generic one.
      toast.error(error?.response?.data?.message ?? "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete{" "}
            <span className="text-foreground font-medium">"{username}"</span>. This action
            cannot be undone.
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
