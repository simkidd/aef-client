import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "@/lib/api/assessment.api";
import { Assessment } from "@/interfaces";
import { toast } from "@/components/ui/toast";

export function useCreateAssessmentMutation(options?: {
  onSuccess?: (data?: Assessment) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Assessment>) => {
      const res = await assessmentApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Assessment Created",
        description: `"${data?.title || "Assessment"}" has been created successfully.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create assessment",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to create assessment.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useGradeSubmissionMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      data,
    }: {
      assessmentId: string;
      data: { enrollmentId: string; score: number; remarks?: string };
    }) => {
      const res = await assessmentApi.gradeSubmission(assessmentId, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to submit grade",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to record grade submission.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useBatchGradeMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      batch,
    }: {
      assessmentId: string;
      batch: Array<{ enrollmentId: string; score: number; remarks?: string }>;
    }) => {
      await Promise.all(
        batch.map((item) =>
          assessmentApi.gradeSubmission(assessmentId, {
            enrollmentId: item.enrollmentId,
            score: item.score,
            remarks: item.remarks,
          })
        )
      );
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      options?.onSuccess?.();
      toast.add({
        title: "Grades Recorded",
        description: "Batch trainee grades have been saved successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to save grades",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to complete batch grading.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}
