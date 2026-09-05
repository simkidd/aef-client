import { useQuery } from '@tanstack/react-query';
import { biometricApi } from '@/lib/api/biometric.api';
import { BiometricDevice } from '@/interfaces';

export function useBiometricDevicesQuery(centreId?: string) {
  return useQuery({
    queryKey: ['biometrics', 'devices', centreId],
    queryFn: async () => {
      const response = await biometricApi.getDevices(centreId);
      return (response?.data || []) as BiometricDevice[];
    },
  });
}
