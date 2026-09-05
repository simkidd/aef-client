import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cohortApi } from '@/lib/api/cohort.api';
import { Cohort } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useCreateCohortMutation(options?: {
  onSuccess?: (data?: Cohort) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Cohort>) => {
      const res = await cohortApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts-all'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Cohort Scheduled',
        description: `"${data?.name || data?.cohortCode || 'Cohort'}" scheduled successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to create cohort',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to schedule cohort batch.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateCohortMutation(options?: {
  onSuccess?: (data?: Cohort) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cohort> }) => {
      const res = await cohortApi.update(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts-all'] });
      queryClient.invalidateQueries({ queryKey: ['cohort', variables.id] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Cohort Updated',
        description: `"${data?.name || data?.cohortCode || 'Cohort'}" updated successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update cohort',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to save cohort changes.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
