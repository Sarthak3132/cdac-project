import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <header>Navbar</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
