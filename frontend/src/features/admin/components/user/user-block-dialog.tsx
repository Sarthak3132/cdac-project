// features/admin/components/user/user-block-dialog.tsx
import { useState } from "react";
import { Loader2, ShieldOff } from "lucide-react";
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

interface BlockUserDialogProps {
  userId: number;
  username: string;
  onBlocked?: () => void; // e.g. refetch the users list
  trigger?: React.ReactNode; // optional custom trigger
}

export function BlockUserDialog({ userId, username, onBlocked, trigger }: BlockUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await api.patch(`/admin/users/${userId}/block`);
      toast.success(`"${username}" blocked successfully`);
      setOpen(false);
      onBlocked?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Failed to block user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" title="Block user">
            <ShieldOff className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block this user?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-foreground font-medium">"{username}"</span> will no longer
            be able to log in or use the platform until unblocked. You can unblock them at any
            time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // prevent auto-close before async call finishes
              handleConfirm();
            }}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Blocking...
              </>
            ) : (
              "Block"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}