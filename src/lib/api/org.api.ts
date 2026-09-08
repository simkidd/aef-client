import { api } from '../client';
import { ApiResponse, Organization, Department } from '@/interfaces';

export const orgApi = {
  /** [ADMIN] Fetch the organisation's profile info (name, logo, mission, contact) */
  getOrgInfo: async (): Promise<ApiResponse<Organization>> => {
    const res = await api.get('/org/info');
    return res.data;
  },

  /** [ADMIN] Update the organisation's profile info */
  updateOrgInfo: async (data: Partial<Organization>): Promise<ApiResponse<Organization>> => {
    const res = await api.put('/org/info', data);
    return res.data;
  },

  /** [ADMIN] List all departments in the organisation */
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await api.get('/org/departments');
    return res.data;
  },

  /** [ADMIN] Create a new department */
  createDepartment: async (data: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await api.post('/org/departments', data);
    return res.data;
  },

  /** [ADMIN] Update an existing department's details */
  updateDepartment: async (id: string, data: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await api.put(`/org/departments/${id}`, data);
    return res.data;
  },
};
