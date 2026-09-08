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
  // ── Portal / Public ────────────────────────────────────────────────────────

  /** [PORTAL] Fetch all currently published & open programmes (browse / apply page) */
  getPublished: async (params?: Record<string, any>): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs/published', { params });
    return res.data;
  },

  /** [PUBLIC] Fetch featured programmes for the public landing page hero section */
  getFeatured: async (): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs/featured');
    return res.data;
  },

  /** [PORTAL] Fetch a single published programme by ID (includes available cohorts) */
  getPublishedById: async (id: string): Promise<ApiResponse<{ program: Program; cohorts: any[] }>> => {
    const res = await api.get(`/programs/published/${id}`);
    return res.data;
  },

  // ── Admin ──────────────────────────────────────────────────────────────────

  /** [ADMIN] List all programmes (all statuses) with optional filters */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Program[]>> => {
    const res = await api.get('/programs', { params });
    return res.data;
  },

  /** [ADMIN] Fetch aggregate programme statistics (counts by status, total applications, etc.) */
  getStats: async (): Promise<ApiResponse<ProgramStats>> => {
    const res = await api.get('/programs/stats');
    return res.data;
  },

  /** [ADMIN] Fetch a single programme by ID (includes all cohorts regardless of status) */
  getById: async (id: string): Promise<ApiResponse<{ program: Program; cohorts: any[] }>> => {
    const res = await api.get(`/programs/${id}`);
    return res.data;
  },

  /** [ADMIN] Create a new programme */
  create: async (data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.post('/programs', data);
    return res.data;
  },

  /** [ADMIN] Update an existing programme (metadata, dates, slots, status, published flag) */
  update: async (id: string, data: Partial<Program>): Promise<ApiResponse<Program>> => {
    const res = await api.put(`/programs/${id}`, data);
    return res.data;
  },

  /** [ADMIN] Delete a programme by ID */
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/programs/${id}`);
    return res.data;
  },

  // ── Skill Areas ────────────────────────────────────────────────────────────

  /** [ADMIN + PORTAL] Fetch all skill area / vocational track definitions */
  getSkillAreas: async (): Promise<ApiResponse<SkillArea[]>> => {
    const res = await api.get('/programs/skills/all');
    return res.data;
  },

  /** [ADMIN] Create a new skill area / vocational track */
  createSkillArea: async (data: Partial<SkillArea>): Promise<ApiResponse<SkillArea>> => {
    const res = await api.post('/programs/skills', data);
    return res.data;
  },

  /** [ADMIN] Update a skill area's metadata (name, category, description) */
  updateSkillArea: async (id: string, data: Partial<SkillArea>): Promise<ApiResponse<SkillArea>> => {
    const res = await api.put(`/programs/skills/${id}`, data);
    return res.data;
  },
};
