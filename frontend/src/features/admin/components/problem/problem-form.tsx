// features/admin/components/problem/problem-form.tsx
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/axios-interceptor";

export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Tag {
  id: number;
  name: string;
}

export interface ProblemFormValues {
  title: string;
  slug: string;
  description: string;
  problemDifficulty: ProblemDifficulty | "";
  timeLimitMs: string;
  memoryLimitKb: string;
  tagIds: number[];
  isPublished: boolean;
}

interface ProblemFormProps {
  mode: "create" | "update";
  initialValues?: Partial<ProblemFormValues>;
  onSubmit: (values: ProblemFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const DEFAULT_VALUES: ProblemFormValues = {
  title: "",
  slug: "",
  description: "",
  problemDifficulty: "",
  timeLimitMs: "1000",
  memoryLimitKb: "65536",
  tagIds: [],
  isPublished: false,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProblemForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: ProblemFormProps) {
  const [values, setValues] = useState<ProblemFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  // In update mode the slug already exists and isn't editable, so treat it as "touched".
  const [slugTouched, setSlugTouched] = useState(mode === "update");
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate the form once the parent has fetched the problem to edit.
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/tags");
        const data = res.data?.data;
        // Handle either a plain array or a paginated { content: [...] } response.
        const list: Tag[] = Array.isArray(data) ? data : (data?.content ?? []);
        if (mounted) setTags(list);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      } finally {
        if (mounted) setTagsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTitleChange = (title: string) => {
    setValues((prev) => ({
      ...prev,
      title,
      // Auto-derive the slug from the title until the user edits it manually.
      slug: mode === "create" && !slugTouched ? slugify(title) : prev.slug,
    }));
  };

  const toggleTag = (tagId: number) => {
    setValues((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (mode === "create" && !values.slug.trim()) next.slug = "Slug is required";
    if (!values.description.trim()) next.description = "Description is required";
    if (!values.problemDifficulty) next.problemDifficulty = "Difficulty is required";
    if (!values.timeLimitMs || Number(values.timeLimitMs) <= 0)
      next.timeLimitMs = "Time limit must be greater than 0";
    if (!values.memoryLimitKb || Number(values.memoryLimitKb) <= 0)
      next.memoryLimitKb = "Memory limit must be greater than 0";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Two Sum"
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
      </div>

      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setValues((prev) => ({ ...prev, slug: e.target.value }));
            }}
            placeholder="e.g. two-sum"
          />
          {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={8}
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Problem statement..."
        />
        {errors.description && (
          <p className="text-destructive text-sm">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={values.problemDifficulty}
            onValueChange={(val) =>
              setValues((prev) => ({ ...prev, problemDifficulty: val as ProblemDifficulty }))
            }
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          {errors.problemDifficulty && (
            <p className="text-destructive text-sm">{errors.problemDifficulty}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimitMs">Time limit (ms)</Label>
          <Input
            id="timeLimitMs"
            type="number"
            min={1}
            value={values.timeLimitMs}
            onChange={(e) => setValues((prev) => ({ ...prev, timeLimitMs: e.target.value }))}
          />
          {errors.timeLimitMs && (
            <p className="text-destructive text-sm">{errors.timeLimitMs}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="memoryLimitKb">Memory limit (KB)</Label>
          <Input
            id="memoryLimitKb"
            type="number"
            min={1}
            value={values.memoryLimitKb}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, memoryLimitKb: e.target.value }))
            }
          />
          {errors.memoryLimitKb && (
            <p className="text-destructive text-sm">{errors.memoryLimitKb}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        {tagsLoading ? (
          <p className="text-muted-foreground text-sm">Loading tags...</p>
        ) : tags.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tags found.</p>
        ) : (
          <div className="flex flex-wrap gap-3 rounded-md border p-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={values.tagIds.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isPublished"
          checked={values.isPublished}
          onCheckedChange={(checked) =>
            setValues((prev) => ({ ...prev, isPublished: checked === true }))
          }
        />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Problem" : "Update Problem"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}