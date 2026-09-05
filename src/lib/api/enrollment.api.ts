import { api } from '../client';
import { ApiResponse, Enrollment } from '@/interfaces';

export const enrollmentApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments', { params });
    return res.data;
  },

  getQueue: async (params?: Record<string, any>): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments/queue', { params });
    return res.data;
  },

  getMy: async (): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments/my');
    return res.data;
  },

  getMyActiveTraining: async (): Promise<ApiResponse<Enrollment>> => {
    const res = await api.get('/enrollments/my-training');
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

  verifyPhysical: async (
    id: string,
    payload: {
      documentsChecked?: boolean;
      identityVerified?: boolean;
      physicalNotes?: string;
    }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/verify-physical`, payload);
    return res.data;
  },

  registerBiometric: async (
    id: string,
    payload: { deviceId?: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/register-biometric`, payload);
    return res.data;
  },

  drop: async (
    id: string,
    payload: { reason: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/drop`, payload);
    return res.data;
  },

  withdraw: async (
    id: string,
    payload: { reason: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/withdraw`, payload);
    return res.data;
  },
};
