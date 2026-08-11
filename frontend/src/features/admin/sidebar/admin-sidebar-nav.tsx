// features/admin/sidebar/AdminSidebarNav.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Languages,
  Code2,
  Tags,
  FlaskConical,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminTab } from "@/types/admin-dashboard";

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "problems", label: "Problems", icon: Code2 },
  { id: "tags", label: "Tags", icon: Tags },
  { id: "testcases", label: "Test Cases", icon: FlaskConical },
  { id: "hints", label: "Hints", icon: Lightbulb },
];

export function AdminSidebarNav() {
  return (
    <nav className="space-y-0.5 px-2">
      <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">
        Management
      </p>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <NavLink
          key={id}
          to={`/admin/${id}`}
          className={({ isActive }) =>
            cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate text-left">{label}</span>
              {isActive && <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
