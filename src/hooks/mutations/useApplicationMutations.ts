import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '@/lib/api/application.api';
import { Application } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useSubmitApplicationMutation(options?: {
  onSuccess?: (data?: Application) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Application>) => {
      const res = await applicationApi.submit(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Application Submitted',
        description: `Application ${data?.applicationNumber || ''} submitted successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Submission Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to submit candidate application.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateApplicationStatusMutation(options?: {
  onSuccess?: (data?: Application) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: string;
      reason?: string;
    }) => {
      const res = await applicationApi.updateStatus(id, status, reason);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-queue'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Application Status Updated',
        description: `Status has been successfully updated to ${variables.status}.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Update Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update application status.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
