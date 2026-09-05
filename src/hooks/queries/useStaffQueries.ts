import { useQuery } from '@tanstack/react-query';
import { staffApi } from '@/lib/api/staff.api';
import { Staff, Department } from '@/interfaces';

export function useStaffListQuery(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['staff', 'list', params?.category, params?.search],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      const res = await staffApi.getAll(Object.fromEntries(queryParams.entries()));
      return (res?.data || []) as Staff[];
    },
  });
}

export function useStaffQuery(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const res = await staffApi.getById(id);
      return res?.data as Staff;
    },
    enabled: !!id,
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: ['departments', 'list'],
    queryFn: async () => {
      const res = await staffApi.getDepartments();
      return (res?.data || []) as Department[];
    },
  });
}
