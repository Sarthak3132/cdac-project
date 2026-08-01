import { Textarea } from "@/components/ui/textarea";

export function InputPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-10 shrink-0 items-center border-b px-4">
        <span className="text-muted-foreground text-sm font-medium">Input</span>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter stdin here (optional)..."
        className="h-full flex-1 resize-none rounded-none border-none font-mono text-sm focus-visible:ring-0"
      />
    </div>
  );
}
