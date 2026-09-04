export interface BiometricDevice {
  _id: string;
  deviceName: string;
  deviceSerial: string;
  centreId: any;
  locationDescription: string;
  model: string;
  status: 'Online' | 'Offline' | 'Syncing' | 'Maintenance';
  registeredTemplatesCount: number;
  lastHeartbeat?: string;
}

export interface BiometricEvent {
  _id: string;
  deviceSerial: string;
  centreId: any;
  biometricToken: string;
  scanType: 'IN' | 'OUT';
  timestamp: string;
  isMatched: boolean;
  beneficiaryId?: any;
}
