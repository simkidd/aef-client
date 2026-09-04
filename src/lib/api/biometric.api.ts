import { api } from '../client';
import { ApiResponse, BiometricDevice, BiometricEvent } from '@/interfaces';

export const biometricApi = {
  getDevices: async (centreId?: string): Promise<ApiResponse<BiometricDevice[]>> => {
    const res = await api.get('/biometrics/devices', { params: { centreId } });
    return res.data;
  },

  registerDevice: async (data: Partial<BiometricDevice>): Promise<ApiResponse<BiometricDevice>> => {
    const res = await api.post('/biometrics/devices', data);
    return res.data;
  },

  recordScanEvent: async (data: {
    deviceSerial: string;
    biometricToken: string;
    centreId: string;
    scanType: 'IN' | 'OUT';
  }): Promise<ApiResponse<BiometricEvent>> => {
    const res = await api.post('/biometrics/scan-event', data);
    return res.data;
  },

  registerTemplate: async (data: {
    beneficiaryId: string;
    enrollmentId: string;
    biometricIdentifier: string;
  }): Promise<ApiResponse<any>> => {
    const res = await api.post('/biometrics/templates', data);
    return res.data;
  },
};
