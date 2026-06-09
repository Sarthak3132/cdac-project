import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <aside>Admin Sidebar</aside>

      <main>
        <Outlet />
      </main>
    </>
  );
}
