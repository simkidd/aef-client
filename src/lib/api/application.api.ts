import { api } from '../client';
import { ApiResponse, Application } from '@/interfaces';

export const applicationApi = {
  /** [ADMIN] List all applications with optional filters (status, programme, cohort, search) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Application[]>> => {
    const res = await api.get('/applications', { params });
    return res.data;
  },

  /** [PORTAL] Fetch the authenticated beneficiary's own applications */
  getMy: async (): Promise<ApiResponse<Application[]>> => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  /** [ADMIN] Fetch a single application by ID */
  getById: async (id: string): Promise<ApiResponse<Application>> => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  /** [PORTAL] Submit a new program application (beneficiary self-service) */
  submit: async (data: Partial<Application>): Promise<ApiResponse<Application>> => {
    const res = await api.post('/applications', data);
    return res.data;
  },

  /** [ADMIN] Update the status of an application (e.g. Pending → Selected / Rejected) */
  updateStatus: async (
    id: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<Application>> => {
    const res = await api.put(`/applications/${id}/status`, { status, reason });
    return res.data;
  },
};
