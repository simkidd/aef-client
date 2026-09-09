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

export function useUpdateUserRolesAndScopesMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        roles?: string[];
        customPermissions?: string[];
        scopeAssignments?: any[];
        isActive?: boolean;
      };
    }) => {
      const response = await adminApi.updateUserRolesAndScopes(id, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users-stats'] });
      toast.add({
        title: 'User Account Updated',
        description: 'User roles, scopes and status updated successfully.',
        type: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.add({
        title: 'Update Failed',
        description: error?.response?.data?.message || 'Failed to update user account.',
        type: 'error',
      });
    },
  });
}
