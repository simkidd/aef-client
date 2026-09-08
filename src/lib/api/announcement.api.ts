import { api } from '../client';
import { ApiResponse, Announcement, Notification, NotificationsResponse } from '@/interfaces';

export const announcementApi = {
  /** [ADMIN + PORTAL] Fetch all published announcements (portal shows widget; admin manages list) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Announcement[]>> => {
    const res = await api.get('/announcements', { params });
    return res.data;
  },

  /** [ADMIN] Create a new announcement broadcast */
  create: async (data: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  /** [ADMIN] Delete an announcement by ID */
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },

  /** [PORTAL] Fetch the authenticated user's personal notification inbox */
  getMyNotifications: async (): Promise<ApiResponse<NotificationsResponse>> => {
    const res = await api.get('/announcements/notifications/my');
    return res.data;
  },

  /** [PORTAL] Mark a specific notification as read */
  markNotificationRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const res = await api.put(`/announcements/notifications/${id}/read`);
    return res.data;
  },
};
