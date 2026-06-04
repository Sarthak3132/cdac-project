// components/navbar/Navbar.tsx
"use client";

import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Code2, Menu, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/slice/authSlice";
import type { RootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Code Compiler", to: "/app/compiler" },
  { label: "Problems", to: "/app/problems" },
];

type NavbarVariant = "public" | "authenticated";

interface NavbarProps {
  variant: NavbarVariant;
}

function NavLinkItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "relative py-1 text-sm font-medium transition-colors",
          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full",
          "after:origin-left after:scale-x-0 after:transition-transform after:duration-200",
          isActive
            ? "text-foreground after:bg-primary after:scale-x-100"
            : "text-muted-foreground hover:text-foreground after:bg-primary hover:after:scale-x-100",
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function Navbar({ variant }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isPublic = variant === "public";
  const isAuthenticated = variant === "authenticated";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
        {/* ── Branding ── */}
        <NavLink
          to={isPublic ? "/" : "/app/compiler"}
          className="text-foreground flex items-center gap-2 font-semibold"
        >
          <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-md">
            <Code2 className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="hidden text-sm sm:inline-block">DevCompiler</span>
        </NavLink>
        {/* ── Desktop Nav ── */}
        {isAuthenticated && (
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLinkItem key={link.to} {...link} />
            ))}
          </nav>
        )}

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

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

          {/* User Dropdown — desktop */}
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden h-8 items-center gap-2 px-2 md:flex">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* ── Mobile Hamburger ── */}
          {isAuthenticated && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  {/* Drawer header */}
                  <div className="border-border flex items-center gap-2 border-b px-4 py-4">
                    <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-md">
                      <Code2 className="text-primary-foreground h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">DevCompiler</span>
                  </div>

                  {/* Drawer nav links */}
                  <nav className="flex flex-1 flex-col gap-1 p-3">
                    {NAV_LINKS.map((link) => (
                      <SheetClose className="justify-between" key={link.to}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {link.label}
                              {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
                            </>
                          )}
                        </NavLink>
                      </SheetClose>
                    ))}
                  </nav>

                  {/* Drawer footer — user + logout */}
                  {isAuthenticated && user && (
                    <>
                      <Separator />
                      <div className="space-y-1 p-3">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium">{user.name}</span>
                            <span className="text-muted-foreground truncate text-xs">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start px-3"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Button>
                        </SheetClose>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
