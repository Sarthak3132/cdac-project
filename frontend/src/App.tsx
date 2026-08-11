import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./app/router";
import { TooltipProvider } from "./components/ui/tooltip";
import { login } from "@/features/auth/slice/authSlice";
import type { AppDispatch } from "@/app/store";
import { api } from "./services/axios-interceptor";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/me");

        dispatch(login(response.data.data));
      } catch (error) {
        console.error("Session restoration failed:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <AppRoutes />
    </TooltipProvider>
  );
}
