import { api } from '../client';
import { ApiResponse, AuditLog } from '@/interfaces';

export const adminApi = {
  getAuditLogs: async (params?: Record<string, any>): Promise<ApiResponse<AuditLog[]>> => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },

  getRoles: async (): Promise<ApiResponse<any>> => {
    const res = await api.get('/admin/roles');
    return res.data;
  },

  updateRolePermissions: async (id: string, permissions: string[]): Promise<ApiResponse<any>> => {
    const res = await api.put(`/admin/roles/${id}`, { permissions });
    return res.data;
  },

  getSystemStats: async (): Promise<ApiResponse<any>> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};
