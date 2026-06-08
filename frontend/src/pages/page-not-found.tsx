import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { House, ArrowLeft, Terminal, MagnifyingGlass } from "@phosphor-icons/react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">

      {/* Big 404 */}
      <p className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-muted-foreground/20 select-none">
        404
      </p>

      {/* Content stacked over the number feel */}
      <div className="flex flex-col items-center gap-5 -mt-6 text-center max-w-md">

        <Badge variant="outline" className="gap-1.5 text-xs uppercase tracking-widest font-semibold">
          <MagnifyingGlass className="w-3.5 h-3.5" weight="bold" />
          Page Not Found
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Looks like this page doesn't exist
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          The page you're looking for may have been moved, deleted, or never
          existed. Double-check the URL or head back to safety.
        </p>

        <Separator className="w-16 my-1" />

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2 rounded-lg font-semibold px-6">
            <Link to="/">
              <House className="w-4 h-4" weight="fill" />
              Back to Home
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="gap-2 rounded-lg font-semibold px-6">
            <Link to="/app/problems">
              <Terminal className="w-4 h-4" weight="bold" />
              Go to Problems
            </Link>
          </Button>
        </div>

        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground mt-1">
          <Link to={-1 as any}>
            <ArrowLeft className="w-4 h-4" weight="bold" />
            Go back
          </Link>
        </Button>

      </div>
    </div>
  );
}