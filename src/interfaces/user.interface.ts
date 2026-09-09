export type ScopeType = 'GLOBAL' | 'CENTRE' | 'PROGRAM' | 'DEPARTMENT';

export interface UserScopeAssignment {
  scopeType: ScopeType;
  targetId?: string;
  targetName?: string;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  isActive?: boolean;
  isStaff: boolean;
  isBeneficiary: boolean;
  roles: string[];
  permissions?: string[];
  customPermissions?: string[];
  scopeAssignments?: UserScopeAssignment[];
  staffRecordId?: any;
  beneficiaryProfileId?: any;
  assignedCentreId?: any;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
