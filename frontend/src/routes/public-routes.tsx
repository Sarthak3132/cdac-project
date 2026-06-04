import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoutes() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/app" replace />;
}
