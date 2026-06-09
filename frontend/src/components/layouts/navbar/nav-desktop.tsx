import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NavLinkItem } from "@/types/navbar";

interface NavDesktopProps {
  links: NavLinkItem[];
}

export function NavDesktop({ links }: NavDesktopProps) {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
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
      ))}
    </nav>
  );
}
