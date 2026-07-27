// features/admin/sidebar/AdminSidebarFooter.tsx
import { Moon, Sun, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { logout } from "@/features/auth/slice/authSlice";
import type { RootState } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/axios-interceptor";

export function AdminSidebarFooter() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="space-y-2 p-3">
      <Separator />

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="text-muted-foreground hover:text-foreground w-full justify-start gap-3 px-3"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 shrink-0" />
        ) : (
          <Moon className="h-4 w-4 shrink-0" />
        )}
        <span className="text-sm">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </Button>

      <Separator />

      {/* User profile */}
      <div className="flex items-center gap-3 rounded-md px-3 py-2">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={user?.avatarUrl} alt={user?.name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{user?.name ?? "Admin"}</p>
          <p className="text-muted-foreground truncate text-[10px]">{user?.email}</p>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start gap-3 px-3"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span className="text-sm">Log out</span>
      </Button>
    </div>
  );
}
