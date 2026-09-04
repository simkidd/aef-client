import { api } from '../client';
import { ApiResponse, Staff, Department } from '@/interfaces';

export const staffApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Staff[]>> => {
    const res = await api.get('/staff', { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Staff>> => {
    const res = await api.get(`/staff/${id}`);
    return res.data;
  },

  create: async (data: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const res = await api.post('/staff', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const res = await api.put(`/staff/${id}`, data);
    return res.data;
  },

  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await api.get('/org/departments');
    return res.data;
  },
};
