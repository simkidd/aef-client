import { useQuery } from '@tanstack/react-query';
import { cohortApi } from '@/lib/api/cohort.api';
import { Cohort } from '@/interfaces';

export function useCohortsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['cohorts', params],
    queryFn: async () => {
      const response = await cohortApi.getAll(params);
      return (response?.data || []) as Cohort[];
    },
  });
}

export function useCohortQuery(id: string) {
  return useQuery({
    queryKey: ['cohort', id],
    queryFn: async () => {
      const response = await cohortApi.getById(id);
      return response?.data as Cohort;
    },
    enabled: !!id,
  });
}

export function useCohortTimetableQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['cohorts', 'timetable', params],
    queryFn: async () => {
      const response = await cohortApi.getTimetable(params);
      return response?.data || [];
    },
  });
}

export function useSessionsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: async () => {
      const response = await cohortApi.getTimetable(params);
      return (response?.data || []) as any[];
    },
  });
}

export function usePortalSessionsQuery(params: { cohortId?: string; publishedOnly?: boolean }) {
  return useQuery({
    queryKey: ['portal-sessions', params],
    queryFn: async () => {
      const response = await cohortApi.getSessions(params);
      return (response?.data || []) as any[];
    },
    enabled: !!params.cohortId,
  });
}

export function useCalendarEventsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['calendar-events', params],
    queryFn: async () => {
      const response = await cohortApi.getCalendarEvents(params);
      return (response?.data || []) as any[];
    },
  });
}
