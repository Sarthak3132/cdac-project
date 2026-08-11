import { Outlet } from "react-router-dom";
import { Navbar } from "../layouts/navbar/navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar variant="authenticated" />
      <main>
        <Outlet />
      </main>
    </>
  );
}
