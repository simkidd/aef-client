import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { toast } from '@/components/ui/toast';

export function useUpdateRolePermissionsMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
      const response = await adminApi.updateRolePermissions(id, permissions);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles-matrix'] });
      toast.add({
        title: 'Permissions Saved',
        description: 'Role permissions matrix updated successfully.',
        type: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.add({
        title: 'Update Failed',
        description: error?.response?.data?.message || 'Failed to update role permissions.',
        type: 'error',
      });
    },
  });
}
