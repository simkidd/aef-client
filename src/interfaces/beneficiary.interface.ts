export interface BeneficiaryProfile {
  _id: string;
  userId: string;
  beneficiaryCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  address?: string;
  stateOfOrigin?: string;
  lgaOfOrigin?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  highestEducation?: string;
  employmentStatus?: string;
  disabilityStatus?: string;
  identificationType?: string;
  identificationNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address?: string;
  };
  profilePhotoUrl?: string;
  biometricRegistered: boolean;
  biometricIdentifier?: string;
  activeEnrollmentId?: any;
}
