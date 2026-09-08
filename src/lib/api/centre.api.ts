import { api } from '../client';
import {
  ApiResponse,
  TrainingCentre,
  RoomFacility,
  Asset,
  DocumentRecord,
  CentreDetailData,
} from '@/interfaces';

export const centreApi = {
  /** [ADMIN + PORTAL] List all training centres (portal uses this for the "preferred centre" dropdown) */
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<TrainingCentre[]>> => {
    const res = await api.get('/centres', { params });
    return res.data;
  },

  /** [ADMIN] Fetch full detail of a single training centre (rooms, assets, staff assignments) */
  getById: async (id: string): Promise<ApiResponse<CentreDetailData>> => {
    const res = await api.get(`/centres/${id}`);
    return res.data;
  },

  /** [ADMIN] Create a new training centre */
  create: async (data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.post('/centres', data);
    return res.data;
  },

  /** [ADMIN] Update a training centre's metadata (name, address, capacity) */
  update: async (id: string, data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.put(`/centres/${id}`, data);
    return res.data;
  },

  /** [ADMIN] Fetch all room / facility records, optionally filtered by centre */
  getFacilities: async (centreId?: string): Promise<ApiResponse<RoomFacility[]>> => {
    const res = await api.get('/centres/facilities', { params: { centreId } });
    return res.data;
  },

  /** [ADMIN] Fetch all room records with optional filters */
  getRooms: async (params?: Record<string, any>): Promise<ApiResponse<RoomFacility[]>> => {
    const res = await api.get('/centres/rooms', { params });
    return res.data;
  },

  /** [ADMIN] Create a new room / facility under a training centre */
  createRoom: async (data: Partial<RoomFacility>): Promise<ApiResponse<RoomFacility>> => {
    const res = await api.post('/centres/rooms', data);
    return res.data;
  },

  /** [ADMIN] Update a room's details (name, capacity, type) */
  updateRoom: async (id: string, data: Partial<RoomFacility>): Promise<ApiResponse<RoomFacility>> => {
    const res = await api.put(`/centres/rooms/${id}`, data);
    return res.data;
  },

  /** [ADMIN] List all physical assets registered to training centres */
  getAssets: async (params?: Record<string, any>): Promise<ApiResponse<Asset[]>> => {
    const res = await api.get('/centres/assets', { params });
    return res.data;
  },

  /** [ADMIN] Register a new physical asset (equipment, furniture) at a centre */
  createAsset: async (data: Partial<Asset>): Promise<ApiResponse<Asset>> => {
    const res = await api.post('/centres/assets', data);
    return res.data;
  },

  /** [ADMIN] List all compliance or operational documents linked to training centres */
  getDocuments: async (params?: Record<string, any>): Promise<ApiResponse<DocumentRecord[]>> => {
    const res = await api.get('/centres/documents', { params });
    return res.data;
  },

  /** [ADMIN] Upload / register a new document record for a centre */
  createDocument: async (data: Partial<DocumentRecord>): Promise<ApiResponse<DocumentRecord>> => {
    const res = await api.post('/centres/documents', data);
    return res.data;
  },
};
