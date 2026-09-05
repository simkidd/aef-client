import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centreApi } from '@/lib/api/centre.api';
import { TrainingCentre } from '@/interfaces';

export function useCreateCentreMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TrainingCentre>) => {
      const res = await centreApi.create(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateCentreMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TrainingCentre> }) => {
      const res = await centreApi.update(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      queryClient.invalidateQueries({ queryKey: ['centre', variables.id] });
      options?.onSuccess?.();
    },
  });
}
