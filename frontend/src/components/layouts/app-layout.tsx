import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar";

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
