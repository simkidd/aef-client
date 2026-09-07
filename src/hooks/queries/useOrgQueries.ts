import { useQuery } from '@tanstack/react-query';
import { orgApi } from '@/lib/api/org.api';

export function useOrgInfoQuery() {
  return useQuery({
    queryKey: ['org', 'info'],
    queryFn: async () => {
      const res = await orgApi.getOrgInfo();
      return res.data;
    },
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: ['org', 'departments'],
    queryFn: async () => {
      const res = await orgApi.getDepartments();
      return res.data;
    },
  });
}
