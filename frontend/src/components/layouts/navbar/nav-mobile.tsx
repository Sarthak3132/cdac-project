import { NavLink } from "react-router-dom";
import { Menu, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavBrand } from "./nav-brand";
import type { NavLinkItem, User } from "@/types/navbar";

interface NavMobileProps {
  links: NavLinkItem[];
  user: User;
  initials: string;
  onLogout: () => void;
}

export function NavMobile({ links, user, initials, onLogout }: NavMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border border-b px-4 py-4">
            <NavBrand to="/app/compiler" />
          </div>

          {/* Nav Links */}
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {links.map(({ to, label }) => (
              <SheetClose key={to}>
                <NavLink
                  to={to}
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
                      {label}
                      {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
                    </>
                  )}
                </NavLink>
              </SheetClose>
            ))}
          </nav>

          {/* Footer — user + logout */}
          <Separator />
          <div className="space-y-1 p-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{user.username}</span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start px-3"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
