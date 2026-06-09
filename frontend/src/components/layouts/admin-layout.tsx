// layouts/AdminLayout.tsx
import { useState } from "react";
import { AdminSidebar } from "@/features/admin/sidebar/admin-sidebar";
import { OverviewTab } from "@/features/admin/tabs/overview-tab";
import { UsersTab } from "@/features/admin/tabs/users-tab";
import { ProblemsTab } from "@/features/admin/tabs/problems-tab";
import { SubmissionsTab } from "@/features/admin/tabs/submissions-tab";
import { LayoutDashboard, Users, Code2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminTab } from "@/types/admin-dashboard";

const TAB_TITLES: Record<AdminTab, string> = {
  overview: "Overview",
  users: "Users",
  problems: "Problems",
  submissions: "Submissions",
};

const MOBILE_TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "problems", label: "Problems", icon: Code2 },
  { id: "submissions", label: "Submissions", icon: Send },
];

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-border flex h-14 shrink-0 items-center border-b px-6">
          <h1 className="text-sm font-semibold">{TAB_TITLES[activeTab]}</h1>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "problems" && <ProblemsTab />}
          {activeTab === "submissions" && <SubmissionsTab />}
        </div>

        {/* Mobile bottom tab bar — hidden on md+ */}
        <nav className="border-border bg-background flex shrink-0 border-t md:hidden">
          {MOBILE_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                activeTab === id ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
