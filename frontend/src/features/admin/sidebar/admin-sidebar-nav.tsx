// features/admin/sidebar/AdminSidebarNav.tsx
import { LayoutDashboard, Users, Code2, Send, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminTab } from "@/types/admin-dashboard";

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users, badge: 7 },
  { id: "problems", label: "Problems", icon: Code2, badge: 6 },
  { id: "submissions", label: "Submissions", icon: Send, badge: 6 },
];

interface AdminSidebarNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminSidebarNav({ activeTab, onTabChange }: AdminSidebarNavProps) {
  return (
    <nav className="space-y-0.5 px-2">
      <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">
        Management
      </p>
      {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            activeTab === id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-medium",
                activeTab === id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {badge}
            </span>
          )}
          {activeTab === id && <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />}
        </button>
      ))}
    </nav>
  );
}
