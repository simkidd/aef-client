import { api } from '../client';
import { ApiResponse, TrainingCentre, RoomFacility } from '@/interfaces';

export const centreApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<TrainingCentre[]>> => {
    const res = await api.get('/centres', { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.get(`/centres/${id}`);
    return res.data;
  },

  create: async (data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.post('/centres', data);
    return res.data;
  },

  update: async (id: string, data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.put(`/centres/${id}`, data);
    return res.data;
  },

  getFacilities: async (centreId?: string): Promise<ApiResponse<RoomFacility[]>> => {
    const res = await api.get('/centres/facilities', { params: { centreId } });
    return res.data;
  },
};
