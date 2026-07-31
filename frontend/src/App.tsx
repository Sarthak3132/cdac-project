import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./app/router";
import { TooltipProvider } from "./components/ui/tooltip";
import { login } from "@/features/auth/slice/authSlice";
import type { AppDispatch } from "@/app/store";
import { api } from "./services/axios-interceptor";

export default function App() {

  return (
    <div>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  );
}
