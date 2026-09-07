import { api } from '../client';
import { ApiResponse, Cohort } from '@/interfaces';

export const cohortApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Cohort[]>> => {
    const res = await api.get('/cohorts', { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.get(`/cohorts/${id}`);
    return res.data;
  },

  getByProgram: async (programId: string): Promise<ApiResponse<Cohort[]>> => {
    const res = await api.get(`/cohorts/program/${programId}`);
    return res.data;
  },

  getTimetable: async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/cohorts/timetable', { params });
    return res.data;
  },

  create: async (data: Partial<Cohort>): Promise<ApiResponse<Cohort>> => {
    const res = await api.post('/cohorts', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Cohort>): Promise<ApiResponse<Cohort>> => {
    const res = await api.put(`/cohorts/${id}`, data);
    return res.data;
  },

  saveTimetableDraft: async (id: string, data: { slots: any[]; publishImmediately?: boolean }): Promise<ApiResponse<{ cohort: Cohort; sessionCount: number }>> => {
    const res = await api.post(`/cohorts/${id}/timetable/draft`, data);
    return res.data;
  },

  publishTimetable: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.post(`/cohorts/${id}/timetable/publish`);
    return res.data;
  },

  unpublishTimetable: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.post(`/cohorts/${id}/timetable/unpublish`);
    return res.data;
  },
};
