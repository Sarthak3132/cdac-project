import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoutes() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "USER") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
