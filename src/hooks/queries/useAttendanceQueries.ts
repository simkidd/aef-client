import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance.api';

export function useAttendanceListQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['attendance', 'list', params],
    queryFn: async () => {
      const response = await attendanceApi.getAll(params);
      return response?.data || [];
    },
  });
}

export function useAttendanceRecordsQuery(params?: Record<string, any>) {
  return useAttendanceListQuery(params);
}

export function useAttendanceSheetQuery(params?: Record<string, any>) {
  return useAttendanceListQuery(params);
}

export function useMyAttendanceQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['attendance', 'my', params],
    queryFn: async () => {
      const response = await attendanceApi.getMy(params);
      return response?.data || [];
    },
  });
}

export function useTodayAttendanceSummaryQuery() {
  return useQuery({
    queryKey: ['attendance', 'today-summary'],
    queryFn: async () => {
      const response = await attendanceApi.getTodaySummary();
      return response;
    },
    refetchInterval: 30 * 1000, // 30s live polling for attendance desk
  });
}
