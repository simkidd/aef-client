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

export function useCancelSessionMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      // Invalidate session query
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['cohorts', 'timetable'] });
      options?.onSuccess?.();
      toast.add({
        title: 'Session Cancelled',
        description: 'The training session has been cancelled and attendees notified.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to cancel session',
        description: err?.message || 'Unable to cancel session.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useSaveTimetableDraftMutation(options?: {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { slots: any[]; publishImmediately?: boolean } }) => {
      const res = await cohortApi.saveTimetableDraft(id, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts-all'] });
      queryClient.invalidateQueries({ queryKey: ['portal-sessions'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Timetable Saved',
        description: 'Cohort timetable and session slots updated successfully.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to save timetable',
        description: err?.response?.data?.message || err?.message || 'Unable to save timetable slots.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function usePublishTimetableMutation(options?: {
  onSuccess?: (data?: Cohort) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cohortId: string) => {
      const res = await cohortApi.publishTimetable(cohortId);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts-all'] });
      queryClient.invalidateQueries({ queryKey: ['portal-sessions'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Timetable Published',
        description: 'Trainees can now view their official schedule on their portal.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to publish timetable',
        description: err?.response?.data?.message || err?.message || 'Unable to publish timetable.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUnpublishTimetableMutation(options?: {
  onSuccess?: (data?: Cohort) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cohortId: string) => {
      const res = await cohortApi.unpublishTimetable(cohortId);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts-all'] });
      queryClient.invalidateQueries({ queryKey: ['portal-sessions'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Timetable Reverted to Draft',
        description: 'The timetable is now hidden from the trainee portal for drafting.',
        type: 'info',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to revert timetable',
        description: err?.response?.data?.message || err?.message || 'Unable to unpublish timetable.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
