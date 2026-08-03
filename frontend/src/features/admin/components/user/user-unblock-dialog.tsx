// features/admin/components/user/user-unblock-button.tsx
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/services/axios-interceptor";

interface UnblockUserButtonProps {
  userId: number;
  username: string;
  onUnblocked?: () => void; // e.g. refetch the users list
}

export function UnblockUserButton({ userId, username, onUnblocked }: UnblockUserButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      await api.patch(`/admin/users/${userId}/unblock`);
      toast.success(`"${username}" unblocked successfully`);
      onUnblocked?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Failed to unblock user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Unblock user"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShieldCheck className="h-4 w-4" />
      )}
    </Button>
  );
}