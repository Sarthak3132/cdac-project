import { Check, Code2 } from "lucide-react";
import type { LanguageOption, ProblemTemplateSummary } from "@/types/problem-template";

interface LanguageSidebarProps {
  languages: LanguageOption[];
  templates: ProblemTemplateSummary[];
  selectedLanguageId: number | null;
  onSelect: (language: LanguageOption) => void;
}

export function LanguageSidebar({
  languages,
  templates,
  selectedLanguageId,
  onSelect,
}: LanguageSidebarProps) {
  return (
    <div className="h-full border-r">
      <div className="border-b px-4 py-4">
        <h2 className="font-medium">Languages</h2>
        <p className="text-muted-foreground mt-1 text-xs">Select a language</p>
      </div>

      <div className="p-2">
        {languages.map((language) => {
          const selected = language.id === selectedLanguageId;
          const configured = templates.some((template) => template.languageId === language.id);

          return (
            <button
              key={language.id}
              type="button"
              onClick={() => onSelect(language)}
              className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm transition ${
                selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                <div>
                  <p>{language.name}</p>
                  <p
                    className={`text-xs ${
                      selected ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  ></p>
                </div>
              </div>

              {configured && (
                <Check
                  className={`h-4 w-4 ${
                    selected ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
