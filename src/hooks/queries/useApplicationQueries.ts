import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/lib/api/application.api';
import { Application } from '@/interfaces';

export function useApplicationsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: async () => {
      const response = await applicationApi.getAll(params);
      return (response?.data || []) as Application[];
    },
  });
}

export function useMyApplicationsQuery() {
  return useQuery({
    queryKey: ['applications', 'my'],
    queryFn: async () => {
      const response = await applicationApi.getMy();
      return (response?.data || []) as Application[];
    },
  });
}

export function useApplicationQuery(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await applicationApi.getById(id);
      return response?.data as Application;
    },
    enabled: !!id,
  });
}
