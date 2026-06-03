import { useEffect } from "react";
import AppRoutes from "./app/router";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  // useEffect(() => {
  //   localStorage.setItem(
  //     "user",
  //     JSON.stringify({
  //       id: "1",
  //       name: "Vishal Borle",
  //       email: "vishal@example.com",
  //       role: "USER",
  //     }),
  //   );
  // }, []);

  return (
    <div>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  );
}
