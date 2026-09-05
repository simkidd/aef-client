import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programApi } from "@/lib/api/program.api";
import { Program, SkillArea } from "@/interfaces";
import { toast } from "@/components/ui/toast";

export function useCreateProgramMutation(options?: {
  onSuccess?: (data?: Program) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Program>) => {
      const res = await programApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Program Created",
        description: `"${data?.title || "Program"}" has been created successfully.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create program",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to create program track.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateProgramMutation(options?: {
  onSuccess?: (data?: Program) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Program>;
    }) => {
      const res = await programApi.update(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-program", variables.id],
      });
      options?.onSuccess?.(data);
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update program",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to update program settings.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateSkillAreaMutation(options?: {
  onSuccess?: (data?: SkillArea) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SkillArea>) => {
      const res = await programApi.createSkillArea(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-areas"] });
      options?.onSuccess?.(data);
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create skill discipline",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to register skill area.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateSkillAreaMutation(options?: {
  onSuccess?: (data?: SkillArea) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SkillArea>;
    }) => {
      const res = await programApi.updateSkillArea(id, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-areas"] });
      options?.onSuccess?.(data);
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update skill discipline",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to save skill changes.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}
