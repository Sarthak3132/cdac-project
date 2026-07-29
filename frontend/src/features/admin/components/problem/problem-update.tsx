import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ProblemForm,
  type ProblemFormValues,
} from "@/features/admin/components/problem/problem-form";

import { api } from "@/services/axios-interceptor";

export default function ProblemUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Partial<ProblemFormValues>>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/problems/${id}`);

      const p = res.data.data;

      setProblem({
        title: p.title,
        slug: p.slug,
        description: p.description,
        problemDifficulty: p.problemDifficulty,
        timeLimitMs: String(p.timeLimitMs),
        memoryLimitKb: String(p.memoryLimitKb),
        isPublished: p.isPublished,

        // Backend should ideally return tag ids.
        tagIds: p.tags?.map((tag: any) => tag.id) ?? [],
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load problem");

      navigate("/admin/problems");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ProblemFormValues) => {
    setIsSubmitting(true);

    try {
      await api.put(`/problems/${id}`, {
        title: values.title,
        description: values.description,
        problemDifficulty: values.problemDifficulty,
        timeLimitMs: Number(values.timeLimitMs),
        memoryLimitKb: Number(values.memoryLimitKb),
        tagIds: values.tagIds,
        isPublished: values.isPublished,
      });

      toast.success("Problem updated successfully");

      navigate("/admin/problems");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Failed to update problem"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Update Problem
        </h1>

        <p className="text-muted-foreground text-sm">
          Update problem details.
        </p>
      </div>

      <ProblemForm
        mode="update"
        initialValues={problem}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/problems")}
      />
    </div>
  );
}