export type ScopeType = 'GLOBAL' | 'CENTRE' | 'PROGRAM' | 'DEPARTMENT';

export interface UserScopeAssignment {
  scopeType: ScopeType;
  targetId?: string;
  targetName?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
  scopeAssignments: UserScopeAssignment[];
  isStaff: boolean;
  isBeneficiary: boolean;
  staffRecordId?: string;
  beneficiaryProfileId?: string;
}
