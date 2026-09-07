import { api } from '../client';
import { ApiResponse, Announcement, Notification, NotificationsResponse } from '@/interfaces';

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

  getMyNotifications: async (): Promise<ApiResponse<NotificationsResponse>> => {
    const res = await api.get('/announcements/notifications/my');
    return res.data;
  },

  markNotificationRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const res = await api.put(`/announcements/notifications/${id}/read`);
    return res.data;
  },
};

