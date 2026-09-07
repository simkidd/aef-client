import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/api/report.api';

export function useOverviewReportQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['reports', 'overview', params],
    queryFn: async () => {
      const response = await reportApi.getOverview(params);
      return response?.data?.kpis || response?.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAttendanceSummaryReportQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['reports', 'attendance-summary', params],
    queryFn: async () => {
      const response = await reportApi.getAttendanceSummary(params);
      return response?.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useImpactReportQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['reports', 'impact', params],
    queryFn: async () => {
      const response = await reportApi.getImpact(params);
      return response?.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useCompletionStatsReportQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['reports', 'completion-stats', params],
    queryFn: async () => {
      const response = await reportApi.getCompletionStats(params);
      return response?.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
