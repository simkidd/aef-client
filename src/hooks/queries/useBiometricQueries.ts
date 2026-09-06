import { useQuery } from "@tanstack/react-query";
import { biometricApi } from "@/lib/api/biometric.api";
import { BiometricDevice, BiometricEvent } from "@/interfaces";

export function useBiometricDevicesQuery(centreId?: string) {
  return useQuery({
    queryKey: ["biometrics", "devices", centreId],
    queryFn: async () => {
      const response = await biometricApi.getDevices(centreId);
      return (response?.data || []) as BiometricDevice[];
    },
  });
}

export function useBiometricEventsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["biometrics", "events", params],
    queryFn: async () => {
      const response = await biometricApi.getEvents(params);
      return {
        docs: (response?.data || []) as BiometricEvent[],
        pagination: response?.pagination,
      };
    },
    refetchInterval: 15 * 1000, // 15s live stream polling for hardware gate events
  });
}
