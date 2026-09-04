export interface EnrollmentVerificationDetails {
  verifiedByStaffId?: any;
  verifiedAt?: string;
  documentsChecked?: boolean;
  identityVerified?: boolean;
  physicalNotes?: string;
}

export interface EnrollmentBiometricDetails {
  registeredAt?: string;
  biometricIdentifier?: string;
}

export interface Enrollment {
  _id: string;
  enrollmentCode: string;
  beneficiaryId: any;
  applicationId: any;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  status: string;
  overallAttendanceRate?: number;
  assessmentPassed?: boolean;
  certificateIssued?: boolean;
  certificateId?: any;
  verificationDetails?: EnrollmentVerificationDetails;
  biometricRegistrationDetails?: EnrollmentBiometricDetails;
  enrolledAt?: string;
  enrollmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
