// features/admin/sidebar/AdminSidebar.tsx
import { Code2 } from "lucide-react";
import { AdminSidebarNav } from "./admin-sidebar-nav";
import { AdminSidebarFooter } from "./admin-sidebar-footer";

export function AdminSidebar() {
  return (
    <aside className="border-border bg-card hidden h-screen w-56 shrink-0 flex-col border-r md:flex">
      <div className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
          <Code2 className="text-primary-foreground h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm leading-tight font-semibold">DevCompiler</p>
          <p className="text-muted-foreground text-[10px]">Admin Panel</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <AdminSidebarNav />
      </div>

      <AdminSidebarFooter />
    </aside>
  );
}
