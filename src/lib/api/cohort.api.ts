import { api } from '../client';
import { ApiResponse, Cohort } from '@/interfaces';

export const cohortApi = {
  /** [ADMIN] List all cohorts with optional filters (programme, status, centre) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Cohort[]>> => {
    const res = await api.get('/cohorts', { params });
    return res.data;
  },

  /** [ADMIN] Fetch a single cohort's full detail by ID */
  getById: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.get(`/cohorts/${id}`);
    return res.data;
  },

  /** [ADMIN] List all cohorts belonging to a specific programme */
  getByProgram: async (programId: string): Promise<ApiResponse<Cohort[]>> => {
    const res = await api.get(`/cohorts/program/${programId}`);
    return res.data;
  },

  /** [ADMIN] Fetch the full timetable (all sessions) for a cohort */
  getTimetable: async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/cohorts/timetable', { params });
    return res.data;
  },

  /** [ADMIN] Create a new cohort under a programme */
  create: async (data: Partial<Cohort>): Promise<ApiResponse<Cohort>> => {
    const res = await api.post('/cohorts', data);
    return res.data;
  },

  /** [ADMIN] Update a cohort's metadata (name, dates, capacity, status) */
  update: async (id: string, data: Partial<Cohort>): Promise<ApiResponse<Cohort>> => {
    const res = await api.put(`/cohorts/${id}`, data);
    return res.data;
  },

  /** [ADMIN] Save a draft timetable for a cohort; optionally publish immediately */
  saveTimetableDraft: async (
    id: string,
    data: { slots: any[]; publishImmediately?: boolean }
  ): Promise<ApiResponse<{ cohort: Cohort; sessionCount: number }>> => {
    const res = await api.post(`/cohorts/${id}/timetable/draft`, data);
    return res.data;
  },

  /** [ADMIN] Publish the timetable for a cohort — makes sessions visible to trainees */
  publishTimetable: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.post(`/cohorts/${id}/timetable/publish`);
    return res.data;
  },

  /** [ADMIN] Unpublish a cohort's timetable — hides sessions from the portal */
  unpublishTimetable: async (id: string): Promise<ApiResponse<Cohort>> => {
    const res = await api.post(`/cohorts/${id}/timetable/unpublish`);
    return res.data;
  },

  /** [PORTAL] Fetch published timetable sessions for a cohort (filtered by cohortId & publishedOnly flag) */
  getSessions: async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/cohorts/schedule/sessions', { params });
    return res.data;
  },

  /** [PORTAL + ADMIN] Fetch training calendar exceptions — public holidays and centre closures */
  getCalendarEvents: async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/cohorts/calendar/events', { params });
    return res.data;
  },
};
