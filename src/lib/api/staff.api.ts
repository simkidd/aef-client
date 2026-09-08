import { api } from '../client';
import { ApiResponse, Staff, Department, Volunteer, Partner } from '@/interfaces';

export const staffApi = {
  // ── Staff Members ──────────────────────────────────────────────────────────

  /** [ADMIN] List all staff members with optional filters (department, role, status) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Staff[]>> => {
    const res = await api.get('/staff', { params });
    return res.data;
  },

  /** [ADMIN] Fetch a single staff member's full profile by ID */
  getById: async (id: string): Promise<ApiResponse<Staff>> => {
    const res = await api.get(`/staff/${id}`);
    return res.data;
  },

  /** [ADMIN] Create a new staff member record */
  create: async (data: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const res = await api.post('/staff', data);
    return res.data;
  },

  /** [ADMIN] Update a staff member's details (role, department, contact) */
  update: async (id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const res = await api.put(`/staff/${id}`, data);
    return res.data;
  },

  /** [ADMIN] Fetch all org departments (shared with org.api — used in staff form dropdowns) */
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await api.get('/org/departments');
    return res.data;
  },

  /** [ADMIN] Provision a portal user account for a staff member and assign system roles */
  provisionAccount: async (
    staffId: string,
    data: { roles: string[] }
  ): Promise<ApiResponse<any>> => {
    const res = await api.post(`/staff/${staffId}/provision-account`, data);
    return res.data;
  },

  // ── Volunteers ─────────────────────────────────────────────────────────────

  /** [ADMIN] List all registered volunteers */
  getVolunteers: async (): Promise<ApiResponse<Volunteer[]>> => {
    const res = await api.get('/staff/volunteers/all');
    return res.data;
  },

  /** [ADMIN] Register a new volunteer */
  createVolunteer: async (data: Partial<Volunteer>): Promise<ApiResponse<Volunteer>> => {
    const res = await api.post('/staff/volunteers', data);
    return res.data;
  },

  // ── Partners ───────────────────────────────────────────────────────────────

  /** [ADMIN] List all registered implementation partners */
  getPartners: async (): Promise<ApiResponse<Partner[]>> => {
    const res = await api.get('/staff/partners/all');
    return res.data;
  },

  /** [ADMIN] Register a new implementation partner */
  createPartner: async (data: Partial<Partner>): Promise<ApiResponse<Partner>> => {
    const res = await api.post('/staff/partners', data);
    return res.data;
  },
};
