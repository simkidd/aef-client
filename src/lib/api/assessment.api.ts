import { api } from '../client';
import { ApiResponse, Assessment } from '@/interfaces';

export const assessmentApi = {
  /** [ADMIN] List all assessments with optional filters (cohort, programme, skill area) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Assessment[]>> => {
    const res = await api.get('/assessments', { params });
    return res.data;
  },

  /** [PORTAL] Fetch the authenticated beneficiary's own assessment grades and scores */
  getMyGrades: async (): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/assessments/my-grades');
    return res.data;
  },

  /** [ADMIN] Create a new assessment (links to a cohort / skill area / programme) */
  create: async (data: Partial<Assessment>): Promise<ApiResponse<Assessment>> => {
    const res = await api.post('/assessments', data);
    return res.data;
  },

  /** [ADMIN] Grade / score a specific enrollment's assessment submission */
  gradeSubmission: async (
    id: string,
    data: { enrollmentId: string; score: number; remarks?: string }
  ): Promise<ApiResponse<any>> => {
    const res = await api.post(`/assessments/${id}/grade`, data);
    return res.data;
  },
};
