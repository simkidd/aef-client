import { api } from '../client';
import { ApiResponse, Assessment } from '@/interfaces';

export const assessmentApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Assessment[]>> => {
    const res = await api.get('/assessments', { params });
    return res.data;
  },

  getMyGrades: async (): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/assessments/my-grades');
    return res.data;
  },

  create: async (data: Partial<Assessment>): Promise<ApiResponse<Assessment>> => {
    const res = await api.post('/assessments', data);
    return res.data;
  },

  gradeSubmission: async (
    id: string,
    data: { enrollmentId: string; score: number; remarks?: string }
  ): Promise<ApiResponse<any>> => {
    const res = await api.post(`/assessments/${id}/grade`, data);
    return res.data;
  },
};
