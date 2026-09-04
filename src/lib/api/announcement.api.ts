import { api } from '../client';
import { ApiResponse, Announcement } from '@/interfaces';

export const announcementApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Announcement[]>> => {
    const res = await api.get('/announcements', { params });
    return res.data;
  },

  create: async (data: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },
};
