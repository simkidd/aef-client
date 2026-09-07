import { api } from '../client';
import { ApiResponse } from '@/interfaces';

export const reportApi = {
  getOverview: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/overview', { params });
    return res.data;
  },

  getImpact: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/impact', { params });
    return res.data;
  },

  getAttendanceSummary: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/attendance-summary', { params });
    return res.data;
  },

  getCompletionStats: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.get('/reports/completion-stats', { params });
    return res.data;
  },
};
