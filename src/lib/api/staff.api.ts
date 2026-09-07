import { api } from '../client';
import { ApiResponse, Staff, Department, Volunteer, Partner } from '@/interfaces';

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

  provisionAccount: async (
    staffId: string,
    data: { roles: string[] }
  ): Promise<ApiResponse<any>> => {
    const res = await api.post(`/staff/${staffId}/provision-account`, data);
    return res.data;
  },

  // Volunteers
  getVolunteers: async (): Promise<ApiResponse<Volunteer[]>> => {
    const res = await api.get('/staff/volunteers/all');
    return res.data;
  },

  createVolunteer: async (data: Partial<Volunteer>): Promise<ApiResponse<Volunteer>> => {
    const res = await api.post('/staff/volunteers', data);
    return res.data;
  },

  // Partners
  getPartners: async (): Promise<ApiResponse<Partner[]>> => {
    const res = await api.get('/staff/partners/all');
    return res.data;
  },

  createPartner: async (data: Partial<Partner>): Promise<ApiResponse<Partner>> => {
    const res = await api.post('/staff/partners', data);
    return res.data;
  },
};
