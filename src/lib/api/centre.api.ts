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
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<TrainingCentre[]>> => {
    const res = await api.get('/centres', { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<CentreDetailData>> => {
    const res = await api.get(`/centres/${id}`);
    return res.data;
  },

  create: async (data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.post('/centres', data);
    return res.data;
  },

  update: async (id: string, data: Partial<TrainingCentre>): Promise<ApiResponse<TrainingCentre>> => {
    const res = await api.put(`/centres/${id}`, data);
    return res.data;
  },

  // Rooms & Facilities
  getRooms: async (params?: Record<string, any>): Promise<ApiResponse<RoomFacility[]>> => {
    const res = await api.get('/centres/facilities/rooms', { params });
    return res.data;
  },

  getFacilities: async (centreId?: string): Promise<ApiResponse<RoomFacility[]>> => {
    const res = await api.get('/centres/facilities/rooms', { params: { centreId } });
    return res.data;
  },

  createRoom: async (data: Partial<RoomFacility>): Promise<ApiResponse<RoomFacility>> => {
    const res = await api.post('/centres/facilities/rooms', data);
    return res.data;
  },

  // Assets
  getAssets: async (params?: Record<string, any>): Promise<ApiResponse<Asset[]>> => {
    const res = await api.get('/centres/assets/all', { params });
    return res.data;
  },

  createAsset: async (data: Partial<Asset>): Promise<ApiResponse<Asset>> => {
    const res = await api.post('/centres/assets', data);
    return res.data;
  },

  // Documents
  getDocuments: async (params?: Record<string, any>): Promise<ApiResponse<DocumentRecord[]>> => {
    const res = await api.get('/centres/documents/all', { params });
    return res.data;
  },

  createDocument: async (data: Partial<DocumentRecord>): Promise<ApiResponse<DocumentRecord>> => {
    const res = await api.post('/centres/documents', data);
    return res.data;
  },
};
