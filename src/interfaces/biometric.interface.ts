export interface BiometricDevice {
  _id: string;
  id?: string;
  deviceName: string;
  name?: string;
  deviceSerial: string;
  serialNumber?: string;
  centreId: any;
  location?: string;
  locationDescription: string;
  model: string;
  status: 'Online' | 'Offline' | 'Syncing' | 'Maintenance';
  registeredTemplatesCount: number;
  lastHeartbeat?: string;
  centre?: any;
}

export interface BiometricEvent {
  _id: string;
  id?: string;
  deviceSerial: string;
  centreId: any;
  biometricToken: string;
  scanType: 'IN' | 'OUT';
  timestamp: string;
  isMatched: boolean;
  beneficiaryId?: any;
}

export interface RawBiometricLog {
  id?: string;
  _id?: string;
  deviceId: string;
  device?: BiometricDevice;
  timestamp: string;
  synced: boolean;
  verificationType?: string;
  beneficiaryId?: string;
  beneficiary?: {
    id?: string;
    fullName?: string;
    studentId?: string;
  };
}
