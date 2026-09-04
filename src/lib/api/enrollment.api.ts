import { api } from '../client';
import { ApiResponse, Enrollment } from '@/interfaces';

export const enrollmentApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments', { params });
    return res.data;
  },

  getMy: async (): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments/my');
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Enrollment>> => {
    const res = await api.get(`/enrollments/${id}`);
    return res.data;
  },

  create: async (data: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post('/enrollments', data);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.put(`/enrollments/${id}/status`, { status, notes });
    return res.data;
  },

  verifyIdentity: async (
    id: string,
    details: { physicalNotes?: string; documentsChecked?: boolean }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/verify-identity`, details);
    return res.data;
  },
};
