import AppRoutes from "./app/router";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  return (
    <div>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  );
}
