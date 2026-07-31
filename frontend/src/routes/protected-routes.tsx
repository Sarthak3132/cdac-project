import type { AppDispatch } from "@/app/store";
import { login } from "@/features/auth/slice/authSlice";
import { api } from "@/services/axios-interceptor";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(!isAuthenticated);

  useEffect(() => {
    // Already authenticated, don't call the server again.
    if (isAuthenticated) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(login(res.data.data));
      } catch {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }  

  return <Outlet />;
}
