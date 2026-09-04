import { api } from '../client';
import { ApiResponse, Application } from '@/interfaces';

export const applicationApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Application[]>> => {
    const res = await api.get('/applications', { params });
    return res.data;
  },

  getMy: async (): Promise<ApiResponse<Application[]>> => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Application>> => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  submit: async (data: Partial<Application>): Promise<ApiResponse<Application>> => {
    const res = await api.post('/applications', data);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<Application>> => {
    const res = await api.put(`/applications/${id}/status`, { status, reason });
    return res.data;
  },
};
