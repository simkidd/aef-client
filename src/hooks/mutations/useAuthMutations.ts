import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores';
import {
  LoginPayload,
  RegisterBeneficiaryPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '@/interfaces';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      if (response.data?.user && response.data?.accessToken) {
        setAuth(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        queryClient.setQueryData(['auth', 'me'], response.data.user);
      }
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterBeneficiaryPayload) => authApi.register(payload),
    onSuccess: (response) => {
      if (response.data?.user && response.data?.accessToken) {
        setAuth(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        queryClient.setQueryData(['auth', 'me'], response.data.user);
      }
    },
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => authApi.sendOtp(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken || undefined),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, any>) => authApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(payload),
  });
}
