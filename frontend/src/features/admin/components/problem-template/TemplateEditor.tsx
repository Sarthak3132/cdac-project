import { Button } from "@/components/ui/button";
import { EditorPanel } from "@/features/code-compiler/components/editor-panel";
import type { LanguageOption } from "@/types/problem-template";

interface TemplateEditorProps {
  language: LanguageOption | null;
  starterCode: string;
  driverCode: string;
  saving: boolean;
  deleting: boolean;
  exists: boolean;

  onStarterCodeChange: (value: string | undefined) => void;
  onDriverCodeChange: (value: string | undefined) => void;

  onSave: () => void;
  onDelete: () => void;
}

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  py: "python",
  js: "javascript",
  java: "java",
  cpp: "cpp",
};

export default function TemplateEditor({
  language,
  starterCode,
  driverCode,
  saving,
  deleting,
  exists,
  onStarterCodeChange,
  onDriverCodeChange,
  onSave,
  onDelete,
}: TemplateEditorProps) {
  if (!language) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Select a language to edit its template.
      </div>
    );
  }

  const monacoLanguage = MONACO_LANGUAGE_MAP[language.shortName?.toLowerCase()] ?? "plaintext";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-semibold">
            {language.name}{" "}
            <span className="text-muted-foreground font-normal">({language.version})</span>
          </h2>

          <p className="text-muted-foreground mt-1 text-xs">
            {exists ? "Editing existing template" : "No template yet — will be created on save"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {exists && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={saving || deleting}
            >
              {deleting ? "Deleting..." : "Delete Template"}
            </Button>
          )}

          <Button size="sm" onClick={onSave} disabled={saving || deleting}>
            {saving ? "Saving..." : exists ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </div>

      {/* Editors */}
      <div className="grid min-h-0 flex-1 grid-rows-2 divide-y">
        {/* Starter Code */}
        <div className="flex min-h-0 flex-col">
          <p className="text-muted-foreground px-5 pt-3 text-xs font-medium uppercase">
            Starter Code
          </p>

          <div className="min-h-0 flex-1 px-2 pb-2">
            <EditorPanel
              language={monacoLanguage}
              value={starterCode}
              onChange={onStarterCodeChange}
            />
          </div>
        </div>

        {/* Driver Code */}
        <div className="flex min-h-0 flex-col">
          <p className="text-muted-foreground px-5 pt-3 text-xs font-medium uppercase">
            Driver Code
          </p>

          <div className="min-h-0 flex-1 px-2 pb-2">
            <EditorPanel
              language={monacoLanguage}
              value={driverCode}
              onChange={onDriverCodeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
