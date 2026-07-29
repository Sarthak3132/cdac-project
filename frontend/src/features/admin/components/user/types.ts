// features/admin/components/user/types.ts
 
// Adjust these values to match your actual UserRole enum constants.
export type UserRole = "USER" | "ADMIN";
 
export interface UserManagementResponse {
  id: number;
  username: string;
  email: string;
  userRole: UserRole;
  enabled: boolean;
  lockUntil: string | null; // ISO instant string, or null if not locked
  createdAt: string;
  deletedAt: string | null;
}
 
/**
 * There's no single "blocked" flag on the backend — status is derived from
 * `enabled` and `lockUntil`. A user counts as blocked if their account is
 * disabled, or if they're locked until some future time.
 */
export function isUserBlocked(user: UserManagementResponse): boolean {
  if (!user.enabled) return true;
  if (user.lockUntil && new Date(user.lockUntil).getTime() > Date.now()) return true;
  return false;
}