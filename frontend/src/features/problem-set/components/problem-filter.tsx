import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProblemFiltersProps } from "@/types/probelm-set";

const LEVELS = ["All", "Easy", "Medium", "Hard"];

export function ProblemFilter({
  search,
  level,
  totalFiltered,
  onSearchChange,
  onLevelChange,
}: ProblemFiltersProps) {
  return (
    <div className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 pr-8 pl-9 text-sm"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            {level === "All" ? "Difficulty" : level}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          <DropdownMenuLabel className="text-xs">Difficulty</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={level} onValueChange={onLevelChange}>
            {LEVELS.map((l) => (
              <DropdownMenuRadioItem key={l} value={l} className="text-xs">
                {l}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="text-muted-foreground ml-auto text-xs tabular-nums">
        {totalFiltered} problems
      </span>
    </div>
  );
}
