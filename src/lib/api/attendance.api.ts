import { api } from '../client';
import { ApiResponse, AttendanceRecord } from '@/interfaces';

export const attendanceApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await api.get('/attendance/sheet', { params });
    return res.data;
  },

  getMy: async (params?: Record<string, any>): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await api.get('/attendance/my-history', { params });
    return res.data;
  },

  clockIn: async (data: { enrollmentId: string; centreId: string; cohortId: string; scanType?: string }): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/clock-in', data);
    return res.data;
  },

  clockOut: async (data: { attendanceId: string }): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/clock-out', data);
    return res.data;
  },

  getTodaySummary: async (centreId?: string): Promise<ApiResponse<any>> => {
    const res = await api.get('/attendance/today-summary', { params: { centreId } });
    return res.data;
  },

  correct: async (
    id: string,
    data: { newStatus: string; reason: string; supportingEvidenceUrl?: string }
  ): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post(`/attendance/corrections/${id}`, data);
    return res.data;
  },

  manualRecord: async (data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/manual-record', data);
    return res.data;
  },
};
