import { api } from '../client';
import { ApiResponse, AttendanceRecord } from '@/interfaces';

export const attendanceApi = {
  /** [ADMIN] Fetch the full attendance sheet with filters (date, centre, cohort, beneficiary) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await api.get('/attendance/sheet', { params });
    return res.data;
  },

  /** [PORTAL] Fetch the authenticated beneficiary's own attendance history */
  getMy: async (params?: Record<string, any>): Promise<ApiResponse<AttendanceRecord[]>> => {
    const res = await api.get('/attendance/my-history', { params });
    return res.data;
  },

  /** [ADMIN / DEVICE] Record a manual clock-in for a beneficiary at a centre */
  clockIn: async (data: {
    enrollmentId: string;
    centreId: string;
    cohortId: string;
    scanType?: string;
  }): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/clock-in', data);
    return res.data;
  },

  /** [ADMIN / DEVICE] Record a clock-out against an open attendance record */
  clockOut: async (data: { attendanceId: string }): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/clock-out', data);
    return res.data;
  },

  /** [ADMIN] Fetch today's clock-in / clock-out summary for the attendance desk (live-polls every 30s) */
  getTodaySummary: async (centreId?: string): Promise<ApiResponse<any>> => {
    const res = await api.get('/attendance/today-summary', { params: { centreId } });
    return res.data;
  },

  /** [ADMIN] Submit a correction request for an incorrect attendance record with supporting evidence */
  correct: async (
    id: string,
    data: { newStatus: string; reason: string; supportingEvidenceUrl?: string }
  ): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post(`/attendance/corrections/${id}`, data);
    return res.data;
  },

  /** [ADMIN] Manually create an attendance record (e.g. for offline / paper-based sessions) */
  manualRecord: async (data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> => {
    const res = await api.post('/attendance/manual-record', data);
    return res.data;
  },
};
