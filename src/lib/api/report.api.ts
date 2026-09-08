import { api } from '../client';
import { ApiResponse } from '@/interfaces';

export const reportApi = {
  /** [ADMIN] Fetch the high-level operational overview (applications, enrollments, attendance KPIs) */
  getOverview: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/overview', { params });
    return res.data;
  },

  /** [ADMIN] Fetch programme impact metrics (beneficiaries reached, certifications issued, skill areas) */
  getImpact: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/impact', { params });
    return res.data;
  },

  /** [ADMIN] Fetch attendance summary across cohorts (rate trends, late arrivals, absences) */
  getAttendanceSummary: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/attendance-summary', { params });
    return res.data;
  },

  /** [ADMIN] Fetch completion / graduation statistics (cohorts completed, pass rates) */
  getCompletionStats: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/completion-stats', { params });
    return res.data;
  },
};
