import { api } from '../client';
import { ApiResponse, Certificate } from '@/interfaces';

export const certificateApi = {
  /** [ADMIN] List all issued certificates across all beneficiaries with optional filters */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Certificate[]>> => {
    const res = await api.get('/certificates', { params });
    return res.data;
  },

  /** [PORTAL] Fetch all certificates issued to the currently authenticated beneficiary */
  getMy: async (): Promise<ApiResponse<Certificate[]>> => {
    const res = await api.get('/certificates/my');
    return res.data;
  },

  /** [PUBLIC] Verify a certificate by its public verification code (used on /verify page) */
  verify: async (code: string): Promise<ApiResponse<Certificate>> => {
    const res = await api.get(`/certificates/verify/${code}`);
    return res.data;
  },

  /** [ADMIN] Issue a new certificate upon cohort completion for a specific enrollment */
  issue: async (data: {
    enrollmentId: string;
    beneficiaryId: string;
    programId: string;
    cohortId: string;
    skillAreaId: string;
    centreId: string;
    overallAttendanceRate: number;
    overallAssessmentScore?: number;
    grade?: string;
  }): Promise<ApiResponse<Certificate>> => {
    const res = await api.post('/certificates', data);
    return res.data;
  },
};
