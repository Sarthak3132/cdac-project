import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/slice/authSlice";
import type { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { NavBrand } from "./nav-brand";
import { NavDesktop } from "./nav-desktop";
import { NavUserDropdown } from "./nav-user-dropdown";
import { NavMobile } from "./nav-mobile";
import type { NavLinkItem } from "@/types/navbar";
import { authService } from "@/features/auth/services/auth-service"

const NAV_LINKS: NavLinkItem[] = [
  { label: "Code Compiler", to: "/app/compiler" },
  { label: "Problems", to: "/app/problems" },
];

type NavbarVariant = "public" | "authenticated";

interface NavbarProps {
  variant: NavbarVariant;
}

export function Navbar({ variant }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const isPublic = variant === "public";
  const isAuthenticated = variant === "authenticated";

  const handleLogout = async () => {
  try {
    // Call backend to clear refresh token
    await authService.logout()
  } catch (err) {
    // Silently fail — even if logout endpoint fails,
    // we still want to clear local state
  } finally {
    // Clear Redux state
    dispatch(logout())
    // Redirect to login
    navigate("/login")
  }
}

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="flex h-14 w-full items-center justify-between px-4 md:px-6">
        {/* Branding */}
        <NavBrand to={isPublic ? "/" : "/app/compiler"} />

        {/* Desktop nav links — center */}
        {isAuthenticated && <NavDesktop links={NAV_LINKS} />}

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Public actions */}
          {isPublic && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}

          {/* Authenticated actions */}
          {isAuthenticated && user && (
            <>
              <NavUserDropdown user={user} initials={initials} onLogout={handleLogout} />
              <NavMobile
                links={NAV_LINKS}
                user={user}
                initials={initials}
                onLogout={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
