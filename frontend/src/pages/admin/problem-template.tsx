import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

import {
  createTemplate,
  deleteTemplate,
  getLanguages,
  getTemplateById,
  getTemplatesByProblem,
  updateTemplate,
} from "@/features/admin/components/problem-template/problem-template-api";

import TemplateEditor from "@/features/admin/components/problem-template/TemplateEditor";
import { LanguageSidebar } from "@/features/admin/components/problem-template/LanguageSidebar";

import type { LanguageOption, ProblemTemplateSummary } from "@/types/problem-template";

interface FormState {
  starterCode: string;
  driverCode: string;
}

const EMPTY_FORM: FormState = {
  starterCode: "",
  driverCode: "",
};

export default function ProblemTemplate() {
  const { problemId, problemTitle } = useParams<{
    problemId: string;
    problemTitle?: string;
  }>();

  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [templates, setTemplates] = useState<ProblemTemplateSummary[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!problemId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const [languageData, templateData] = await Promise.all([
          getLanguages(),
          getTemplatesByProblem(problemId as string),
        ]);

        const enabledLanguages = languageData.filter((language) => language.enabled);

        setLanguages(enabledLanguages);
        setTemplates(templateData);

        if (enabledLanguages.length > 0) {
          setSelectedLanguageId(enabledLanguages[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [problemId]);

  const selectedLanguage = useMemo(() => {
    return languages.find((language) => language.id === selectedLanguageId) ?? null;
  }, [languages, selectedLanguageId]);

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => template.languageId === selectedLanguageId) ?? null;
  }, [templates, selectedLanguageId]);

  useEffect(() => {
    if (!selectedLanguageId) {
      setForm(EMPTY_FORM);
      return;
    }

    const template = templates.find((item) => item.languageId === selectedLanguageId);

    if (!template) {
      setForm(EMPTY_FORM);
      setLoadingTemplate(false);
      return;
    }

    let cancelled = false;

    async function loadTemplate() {
      try {
        setLoadingTemplate(true);

        const details = await getTemplateById(template!.id);

        if (cancelled) return;

        setForm({
          starterCode: details.starterCode,
          driverCode: details.driverCode,
        });
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          toast.error("Failed to load template");
        }
      } finally {
        if (!cancelled) {
          setLoadingTemplate(false);
        }
      }
    }

    loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [selectedLanguageId, templates]);

  function handleLanguageSelect(language: LanguageOption) {
    if (language.id === selectedLanguageId) {
      return;
    }

    setSelectedLanguageId(language.id);
  }

  async function handleSave() {
    if (!problemId || !selectedLanguage) {
      return;
    }

    if (!form.starterCode.trim()) {
      toast.error("Starter code is required");
      return;
    }

    if (!form.driverCode.trim()) {
      toast.error("Driver code is required");
      return;
    }

    try {
      setSaving(true);

      if (selectedTemplate) {
        const updated = await updateTemplate(selectedTemplate.id, {
          starterCode: form.starterCode,
          driverCode: form.driverCode,
        });

        setTemplates((current) =>
          current.map((template) => (template.id === selectedTemplate.id ? updated : template)),
        );

        toast.success("Template updated");
      } else {
        const created = await createTemplate({
          problemId,
          languageId: selectedLanguage.id,
          starterCode: form.starterCode,
          driverCode: form.driverCode,
        });

        setTemplates((current) => [...current, created]);

        toast.success("Template created");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedTemplate) {
      return;
    }

    try {
      setDeleting(true);

      await deleteTemplate(selectedTemplate.id);

      setTemplates((current) => current.filter((template) => template.id !== selectedTemplate.id));

      setForm(EMPTY_FORM);

      toast.success("Template deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete template");
    } finally {
      setDeleting(false);
    }
  }

  if (!problemId) {
    return <div className="text-muted-foreground p-6 text-sm">No problem selected.</div>;
  }

  const decodedTitle = problemTitle ? decodeURIComponent(problemTitle) : "this problem";

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-72" />

        <div className="grid w-full grid-cols-[320px_minmax(0,1fr)] gap-4">
          <Skeleton className="h-[calc(100vh-150px)] w-full" />
          <Skeleton className="h-[calc(100vh-150px)] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-5">
      {/* Header */}
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Language Templates</h1>

        <p className="text-muted-foreground text-sm">
          Manage starter and driver code for <span className="font-medium">{decodedTitle}</span>
        </p>
      </div>

      {/* Main Template Area */}
      <div className="grid h-full w-full min-w-0 grid-cols-[320px_minmax(0,1fr)] overflow-hidden rounded-lg border">
        {/* Sidebar */}
        <div className="min-w-0">
          <LanguageSidebar
            languages={languages}
            templates={templates}
            selectedLanguageId={selectedLanguageId}
            onSelect={handleLanguageSelect}
          />
        </div>

        {/* Editor */}
        <div className="h-full min-w-0 overflow-hidden">
          {loadingTemplate ? (
            <div className="space-y-5 p-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-75 w-full" />
              <Skeleton className="h-75 w-full" />
            </div>
          ) : (
            <TemplateEditor
              language={selectedLanguage}
              starterCode={form.starterCode}
              driverCode={form.driverCode}
              saving={saving}
              deleting={deleting}
              exists={selectedTemplate !== null}
              onStarterCodeChange={(value) =>
                setForm((current) => ({
                  ...current,
                  starterCode: value ?? "",
                }))
              }
              onDriverCodeChange={(value) =>
                setForm((current) => ({
                  ...current,
                  driverCode: value ?? "",
                }))
              }
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
