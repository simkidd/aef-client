import { api } from '../client';
import { ApiResponse, Organization, Department } from '@/interfaces';

export const orgApi = {
  getOrgInfo: async (): Promise<ApiResponse<Organization>> => {
    const res = await api.get('/org/info');
    return res.data;
  },

  updateOrgInfo: async (data: Partial<Organization>): Promise<ApiResponse<Organization>> => {
    const res = await api.put('/org/info', data);
    return res.data;
  },

  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await api.get('/org/departments');
    return res.data;
  },

  createDepartment: async (data: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await api.post('/org/departments', data);
    return res.data;
  },

  updateDepartment: async (id: string, data: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await api.put(`/org/departments/${id}`, data);
    return res.data;
  },
};
