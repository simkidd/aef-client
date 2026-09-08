import { api } from '../client';
import { ApiResponse, Enrollment } from '@/interfaces';

export const enrollmentApi = {
  /** [ADMIN] List all enrollments across all beneficiaries with optional filters */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments', { params });
    return res.data;
  },

  /** [ADMIN] Fetch the enrollment queue — candidates awaiting physical verification or biometric scan */
  getQueue: async (params?: Record<string, any>): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments/queue', { params });
    return res.data;
  },

  /** [PORTAL] Fetch all enrollments belonging to the authenticated beneficiary */
  getMy: async (): Promise<ApiResponse<Enrollment[]>> => {
    const res = await api.get('/enrollments/my');
    return res.data;
  },

  /** [PORTAL] Fetch the beneficiary's current active training enrollment (includes cohort/centre/attendance) */
  getMyActiveTraining: async (): Promise<ApiResponse<Enrollment>> => {
    const res = await api.get('/enrollments/my-training');
    return res.data;
  },

  /** [ADMIN] Fetch a single enrollment by ID */
  getById: async (id: string): Promise<ApiResponse<Enrollment>> => {
    const res = await api.get(`/enrollments/${id}`);
    return res.data;
  },

  /** [ADMIN] Manually create an enrollment record */
  create: async (data: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post('/enrollments', data);
    return res.data;
  },

  /** [ADMIN] Update an enrollment's status (e.g. Selected → Active, Active → Completed) */
  updateStatus: async (
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.put(`/enrollments/${id}/status`, { status, notes });
    return res.data;
  },

  /** [ADMIN] Record the outcome of a physical document/identity verification at the centre */
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

  /** [ADMIN] Trigger biometric device registration for an enrollment */
  registerBiometric: async (
    id: string,
    payload: { deviceId?: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/register-biometric`, payload);
    return res.data;
  },

  /** [ADMIN] Drop a beneficiary from a cohort (admin-initiated) */
  drop: async (
    id: string,
    payload: { reason: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/drop`, payload);
    return res.data;
  },

  /** [PORTAL] Withdraw a beneficiary from a cohort (self-service request) */
  withdraw: async (
    id: string,
    payload: { reason: string }
  ): Promise<ApiResponse<Enrollment>> => {
    const res = await api.post(`/enrollments/${id}/withdraw`, payload);
    return res.data;
  },
};
