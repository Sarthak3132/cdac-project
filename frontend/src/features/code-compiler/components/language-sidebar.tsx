import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import type { Language } from "@/types/code-compiler";

export function LanguageSidebar({
  languages,
  selected,
  onSelect,
}: {
  languages: Language[];
  selected: Language;
  onSelect: (l: Language) => void;
}) {
  return (
    <aside className="border-border bg-muted/30 flex w-12 shrink-0 flex-col items-center gap-1 border-r py-3">
      {languages.map((lang) => (
        <Tooltip key={lang.id} delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelect(lang)}
              className={cn(
                "h-9 w-9 rounded-md p-0 font-mono text-xs",
                selected.id === lang.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {lang.label}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{lang.label}</TooltipContent>
        </Tooltip>
      ))}
    </aside>
  );
}
