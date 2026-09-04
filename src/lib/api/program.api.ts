import { api } from '../client';
import { ApiResponse, Program, SkillArea } from '@/interfaces';

export const programApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs', { params });
    return res.data;
  },

  getFeatured: async (): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs/featured');
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Program>> => {
    const res = await api.get(`/programs/${id}`);
    return res.data;
  },

  create: async (data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.post('/programs', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.put(`/programs/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/programs/${id}`);
    return res.data;
  },

  getSkillAreas: async (): Promise<ApiResponse<SkillArea[]>> => {
    const res = await api.get('/programs/skills');
    return res.data;
  },
};
