import { useQuery } from '@tanstack/react-query';
import { centreApi } from '@/lib/api/centre.api';
import {
  TrainingCentre,
  RoomFacility,
  Asset,
  DocumentRecord,
  CentreDetailData,
} from '@/interfaces';

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
      return res?.data as CentreDetailData;
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

export function useRoomsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['rooms', 'list', params],
    queryFn: async () => {
      const res = await centreApi.getRooms(params);
      return (res?.data || []) as RoomFacility[];
    },
  });
}

export function useAssetsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['assets', 'list', params],
    queryFn: async () => {
      const res = await centreApi.getAssets(params);
      return (res?.data || []) as Asset[];
    },
  });
}

export function useDocumentsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['documents', 'list', params],
    queryFn: async () => {
      const res = await centreApi.getDocuments(params);
      return (res?.data || []) as DocumentRecord[];
    },
  });
}
