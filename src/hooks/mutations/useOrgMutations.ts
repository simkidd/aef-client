import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orgApi } from '@/lib/api/org.api';
import { Organization, Department } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useUpdateOrgInfoMutation(options?: {
  onSuccess?: (data?: Organization) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const res = await orgApi.updateOrgInfo(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org', 'info'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Organization Updated',
        description: 'Organization master profile saved successfully.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update organization',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to save organization profile.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateDepartmentMutation(options?: {
  onSuccess?: (data?: Department) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Department>) => {
      const res = await orgApi.createDepartment(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org', 'departments'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Department Created',
        description: `"${data?.name || 'Department'}" created successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to create department',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to create department unit.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateDepartmentMutation(options?: {
  onSuccess?: (data?: Department) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Department> }) => {
      const res = await orgApi.updateDepartment(id, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org', 'departments'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Department Updated',
        description: `"${data?.name || 'Department'}" updated successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update department',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to update department details.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
