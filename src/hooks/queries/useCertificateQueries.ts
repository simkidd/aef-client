import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi } from '@/lib/api/certificate.api';
import { Certificate } from '@/interfaces';

export function useCertificatesQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['admin-certificates', params],
    queryFn: async () => {
      const response = await certificateApi.getAll(params);
      return {
        docs: (response?.data || []) as Certificate[],
        pagination: response?.pagination,
      };
    },
  });
}

export function useMyCertificatesQuery() {
  return useQuery({
    queryKey: ['certificates', 'my'],
    queryFn: async () => {
      const response = await certificateApi.getMy();
      return (response?.data || []) as Certificate[];
    },
  });
}

export function useIssueCertificateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof certificateApi.issue>[0]) =>
      certificateApi.issue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    },
  });
}
