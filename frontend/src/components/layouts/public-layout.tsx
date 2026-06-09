import { Navbar } from "../layouts/navbar/navbar";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <>
      <Navbar variant="public" />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PublicLayout;
