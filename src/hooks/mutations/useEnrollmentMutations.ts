import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi } from '@/lib/api/enrollment.api';
import { Enrollment } from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useVerifyPhysicalMutation(options?: {
  onSuccess?: (data?: Enrollment) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        documentsChecked?: boolean;
        identityVerified?: boolean;
        physicalNotes?: string;
      };
    }) => {
      const res = await enrollmentApi.verifyPhysical(id, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-queue'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Physical Verification Approved',
        description: 'Candidate documents and identity have been verified successfully.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Verification Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to approve physical verification.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useRegisterBiometricMutation(options?: {
  onSuccess?: (data?: Enrollment) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      deviceId,
    }: {
      id: string;
      deviceId?: string;
    }) => {
      const res = await enrollmentApi.registerBiometric(id, { deviceId });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-queue'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Biometrics Captured & Activated',
        description: 'Candidate biometric template has been bound and enrolled actively.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Biometric Capture Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to register biometric template.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useDropTraineeMutation(options?: {
  onSuccess?: (data?: Enrollment) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) => {
      const res = await enrollmentApi.drop(id, { reason });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-queue'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Trainee Dropped',
        description: 'Trainee transitioned to dropped status. Audit record preserved.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Action Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update trainee status.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
