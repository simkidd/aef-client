import { useQuery } from '@tanstack/react-query';
import { centreApi } from '@/lib/api/centre.api';
import { TrainingCentre, RoomFacility } from '@/interfaces';

export function useCentresQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['centres', 'list', params],
    queryFn: async () => {
      const res = await centreApi.getAll(params);
      return (res?.data || []) as TrainingCentre[];
    },
  });
}

export function useCentreQuery(id: string) {
  return useQuery({
    queryKey: ['centre', id],
    queryFn: async () => {
      const res = await centreApi.getById(id);
      return res?.data as TrainingCentre;
    },
    enabled: !!id,
  });
}

export function useFacilitiesQuery(centreId?: string) {
  return useQuery({
    queryKey: ['facilities', centreId],
    queryFn: async () => {
      const res = await centreApi.getFacilities(centreId);
      return (res?.data || []) as RoomFacility[];
    },
  });
}
