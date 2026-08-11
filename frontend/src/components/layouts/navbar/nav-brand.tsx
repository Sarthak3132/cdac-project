import { NavLink } from "react-router-dom";
import { Code2 } from "lucide-react";

export function NavBrand({ to }: { to: string }) {
  return (
    <NavLink to={to} className="text-foreground flex items-center gap-2 font-semibold">
      <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-md">
        <Code2 className="text-primary-foreground h-4 w-4" />
      </div>
      <span className="hidden text-sm sm:inline-block">DevCompiler</span>
    </NavLink>
  );
}
