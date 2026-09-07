import { useQuery } from '@tanstack/react-query';
import { staffApi } from '@/lib/api/staff.api';
import { Staff, Volunteer, Partner } from '@/interfaces';

export function useStaffListQuery(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}) {
  return useQuery({
    queryKey: ['staff', 'list', params],
    queryFn: async () => {
      const res = await staffApi.getAll(params);
      return {
        docs: (res?.data || []) as Staff[],
        pagination: res?.pagination,
      };
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

export function useVolunteersQuery() {
  return useQuery({
    queryKey: ['volunteers', 'all'],
    queryFn: async () => {
      const res = await staffApi.getVolunteers();
      return (res?.data || []) as Volunteer[];
    },
  });
}

export function usePartnersQuery() {
  return useQuery({
    queryKey: ['partners', 'all'],
    queryFn: async () => {
      const res = await staffApi.getPartners();
      return (res?.data || []) as Partner[];
    },
  });
}
