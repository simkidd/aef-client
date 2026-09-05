import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centreApi } from '@/lib/api/centre.api';
import { TrainingCentre } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useCreateCentreMutation(options?: {
  onSuccess?: (data?: TrainingCentre) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TrainingCentre>) => {
      const res = await centreApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Centre Created',
        description: `"${data?.name || 'Training Centre'}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to create centre',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to register training centre.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateCentreMutation(options?: {
  onSuccess?: (data?: TrainingCentre) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TrainingCentre> }) => {
      const res = await centreApi.update(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      queryClient.invalidateQueries({ queryKey: ['centre', variables.id] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Centre Updated',
        description: `"${data?.name || 'Training Centre'}" updated successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update centre',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to update training centre.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
