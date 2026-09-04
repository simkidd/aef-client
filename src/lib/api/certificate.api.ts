import { api } from '../client';
import { ApiResponse, Certificate } from '@/interfaces';

export const certificateApi = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Certificate[]>> => {
    const res = await api.get('/certificates', { params });
    return res.data;
  },

  getMy: async (): Promise<ApiResponse<Certificate[]>> => {
    const res = await api.get('/certificates/my');
    return res.data;
  },

  verify: async (code: string): Promise<ApiResponse<Certificate>> => {
    const res = await api.get(`/certificates/verify/${code}`);
    return res.data;
  },

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
