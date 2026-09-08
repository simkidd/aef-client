import { api } from '../client';
import { ApiResponse, BiometricDevice, BiometricEvent } from '@/interfaces';

export const biometricApi = {
  /** [ADMIN] List all registered biometric devices, optionally filtered by centre */
  getDevices: async (centreId?: string): Promise<ApiResponse<BiometricDevice[]>> => {
    const res = await api.get('/biometrics/devices', { params: { centreId } });
    return res.data;
  },

  /** [ADMIN] List raw biometric scan events with optional filters (date, centre, beneficiary) */
  getEvents: async (params?: Record<string, any>): Promise<ApiResponse<BiometricEvent[]>> => {
    const res = await api.get('/biometrics/events', { params });
    return res.data;
  },

  /** [ADMIN] Register a new biometric device at a training centre */
  registerDevice: async (data: Partial<BiometricDevice>): Promise<ApiResponse<BiometricDevice>> => {
    const res = await api.post('/biometrics/devices', data);
    return res.data;
  },

  /** [ADMIN / DEVICE] Record a fingerprint scan event (clock-in or clock-out) from a device */
  recordScanEvent: async (data: {
    deviceSerial: string;
    biometricToken: string;
    centreId?: string;
    scanType?: 'IN' | 'OUT';
  }): Promise<ApiResponse<BiometricEvent>> => {
    const res = await api.post('/biometrics/scan', data);
    return res.data;
  },

  /** [ADMIN] Register a beneficiary's biometric fingerprint template against their enrollment */
  registerTemplate: async (data: {
    beneficiaryId: string;
    enrollmentId: string;
    biometricIdentifier: string;
  }): Promise<ApiResponse<any>> => {
    const res = await api.post('/biometrics/templates', data);
    return res.data;
  },
};
