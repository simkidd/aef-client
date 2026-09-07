import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/lib/api/staff.api';
import { Staff, Volunteer, Partner } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useCreateStaffMutation(options?: {
  onSuccess?: (data?: Staff) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Staff>) => {
      const res = await staffApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Staff Member Created',
        description: `"${data?.firstName} ${data?.lastName}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to create staff member',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to register staff record.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateStaffMutation(options?: {
  onSuccess?: (data?: Staff) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Staff> }) => {
      const res = await staffApi.update(id, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Staff Record Updated',
        description: `"${data?.firstName} ${data?.lastName}" updated successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update staff record',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to update staff record.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useProvisionAccountMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
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
      toast.add({
        title: 'Account Provisioned',
        description: 'User access credentials have been provisioned successfully.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Provisioning Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to provision staff account.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateVolunteerMutation(options?: {
  onSuccess?: (data?: Volunteer) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Volunteer>) => {
      const res = await staffApi.createVolunteer(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Volunteer Registered',
        description: `"${data?.firstName} ${data?.lastName}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Registration Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to register volunteer.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreatePartnerMutation(options?: {
  onSuccess?: (data?: Partner) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Partner>) => {
      const res = await staffApi.createPartner(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Partner Registered',
        description: `"${data?.name}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Registration Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to register partner.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
