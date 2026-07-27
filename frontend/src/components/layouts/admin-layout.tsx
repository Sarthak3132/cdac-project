// components/layouts/admin-layout.tsx
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin/sidebar/admin-sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
