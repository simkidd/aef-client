export interface AuditLog {
  _id: string;
  userEmail: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  reason?: string;
  beforeState?: any;
  afterState?: any;
}
