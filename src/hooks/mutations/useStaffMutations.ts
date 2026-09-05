import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/lib/api/staff.api';
import { Staff } from '@/interfaces';

export function useCreateStaffMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Staff>) => {
      const res = await staffApi.create(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateStaffMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Staff> }) => {
      const res = await staffApi.update(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      options?.onSuccess?.();
    },
  });
}

export function useProvisionAccountMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      staffId,
      roles,
    }: {
      staffId: string;
      roles: string[];
    }) => {
      const res = await staffApi.provisionAccount(staffId, { roles });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      options?.onSuccess?.();
    },
  });
}
