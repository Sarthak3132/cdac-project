import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ProblemForm } from "@/features/admin/components/problem/problem-form";
import type { ProblemFormValues } from "@/features/admin/components/problem/problem-form";
import { api } from "@/services/axios-interceptor";

export default function ProblemCreate() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProblemFormValues) => {
    setIsSubmitting(true);

    try {
      await api.post("/problems", {
        title: values.title,
        slug: values.slug,
        description: values.description,
        problemDifficulty: values.problemDifficulty,
        timeLimitMs: Number(values.timeLimitMs),
        memoryLimitKb: Number(values.memoryLimitKb),
        tagIds: values.tagIds,
        isPublished: values.isPublished,
      });

      toast.success("Problem created successfully");

      navigate("/admin/problems");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ??
        "Failed to create problem";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Create Problem
        </h1>

        <p className="text-muted-foreground text-sm">
          Add a new coding problem to the platform.
        </p>
      </div>

      <ProblemForm
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/problems")}
      />
    </div>
  );
}