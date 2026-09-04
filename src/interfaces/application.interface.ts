export interface ApplicationStatusHistory {
  status: string;
  changedBy: any;
  changedAt: string;
  reason?: string;
}

export interface Application {
  _id: string;
  applicationNumber: string;
  beneficiaryId: any;
  programId: any;
  preferredSkillAreaId: any;
  preferredCentreId?: any;
  status: string;
  statusReason?: string;
  statementOfPurpose?: string;
  previousExperience?: string;
  submittedAt: string;
  statusHistory?: ApplicationStatusHistory[];
}
