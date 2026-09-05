import { api } from '../client';
import { ApiResponse, Program, SkillArea } from '@/interfaces';

export interface ProgramStats {
  totalPrograms: number;
  adeleOwned: number;
  partnerInitiatives: number;
  activePrograms: number;
  draftPrograms: number;
  archivedPrograms: number;
  publishedPrograms: number;
  totalApplications: number;
  totalCohorts: number;
}

export const programApi = {
  // Public
  getPublished: async (params?: Record<string, any>): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs/published', { params });
    return res.data;
  },

  getFeatured: async (): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs/featured');
    return res.data;
  },

  getPublishedById: async (id: string): Promise<ApiResponse<{ program: Program; cohorts: any[] }>> => {
    const res = await api.get(`/programs/published/${id}`);
    return res.data;
  },

  // Admin
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs', { params });
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<ProgramStats>> => {
    const res = await api.get('/programs/stats');
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ program: Program; cohorts: any[] }>> => {
    const res = await api.get(`/programs/${id}`);
    return res.data;
  },

  create: async (data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.post('/programs', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.put(`/programs/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/programs/${id}`);
    return res.data;
  },

  // Skill Areas
  getSkillAreas: async (): Promise<ApiResponse<SkillArea[]>> => {
    const res = await api.get('/programs/skills/all');
    return res.data;
  },

  createSkillArea: async (data: Partial<SkillArea>): Promise<ApiResponse<SkillArea>> => {
    const res = await api.post('/programs/skills', data);
    return res.data;
  },

  updateSkillArea: async (id: string, data: Partial<SkillArea>): Promise<ApiResponse<SkillArea>> => {
    const res = await api.put(`/programs/skills/${id}`, data);
    return res.data;
  },
};
