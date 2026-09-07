import { useMutation, useQueryClient } from "@tanstack/react-query";
import { biometricApi } from "@/lib/api/biometric.api";
import { BiometricDevice } from "@/interfaces";

export function useProcessBiometricScanMutation(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      deviceSerial: string;
      biometricToken: string;
      scanType?: "IN" | "OUT";
      timestamp?: string;
      metadata?: Record<string, any>;
    }) => {
      const response = await biometricApi.recordScanEvent(payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["biometrics", "events"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export function useRegisterBiometricDeviceMutation(options?: {
  onSuccess?: (data?: BiometricDevice) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<BiometricDevice>) => {
      const response = await biometricApi.registerDevice(payload);
      return response?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["biometrics", "devices"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export function useRegisterBiometricTemplateMutation(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      beneficiaryId: string;
      enrollmentId: string;
      biometricIdentifier: string;
    }) => {
      const response = await biometricApi.registerTemplate(payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment-queue"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
