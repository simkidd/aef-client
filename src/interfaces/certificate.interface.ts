export interface CertificateSignatory {
  name: string;
  title: string;
}

export interface Certificate {
  _id: string;
  certificateNumber: string;
  verificationCode: string;
  beneficiaryId: any;
  enrollmentId: any;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  issueDate: string;
  overallAttendanceRate: number;
  overallAssessmentScore?: number;
  grade?: string;
  authorizedSignatory: CertificateSignatory;
  issuingOrganization: string;
  status: string;
}
