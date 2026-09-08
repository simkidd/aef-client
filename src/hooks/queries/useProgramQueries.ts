import { useQuery } from '@tanstack/react-query';
import { programApi, ProgramStats } from '@/lib/api/program.api';
import { Program, SkillArea } from '@/interfaces';

export function useProgramsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['admin-programs', params],
    queryFn: async () => {
      const response = await programApi.getAll(params);
      return (response?.data || []) as Program[];
    },
  });
}

export function useProgramStatsQuery() {
  return useQuery({
    queryKey: ['admin-programs-stats'],
    queryFn: async () => {
      const response = await programApi.getStats();
      return response?.data as ProgramStats;
    },
  });
}

export function usePublishedProgramsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['portal-published-programs', params],
    queryFn: async () => {
      const response = await programApi.getPublished(params);
      return (response?.data || []) as Program[];
    },
  });
}

export function useProgramQuery(id: string) {
  return useQuery({
    queryKey: ['admin-program', id],
    queryFn: async () => {
      const response = await programApi.getById(id);
      return response?.data as { program: Program; cohorts: any[] };
    },
    enabled: !!id,
  });
}

export function usePublishedProgramQuery(id: string) {
  return useQuery({
    queryKey: ['portal-published-program', id],
    queryFn: async () => {
      const response = await programApi.getPublishedById(id);
      return response?.data as { program: Program; cohorts: any[] };
    },
    enabled: !!id,
  });
}

export function useSkillAreasQuery() {
  return useQuery({
    queryKey: ['admin-skill-areas'],
    queryFn: async () => {
      const response = await programApi.getSkillAreas();
      return (response?.data || []) as SkillArea[];
    },
  });
}
