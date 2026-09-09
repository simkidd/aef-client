import { BeneficiaryProfile } from '@/interfaces';

export interface ProfileCompletion {
  isComplete: boolean;
  missingFields: string[];
  completionPercent: number;
}

const MISSING_LABELS: Record<string, string> = {
  dateOfBirth: 'Date of birth',
  address: 'Residential address',
  highestEducation: 'Highest education',
  employmentStatus: 'Employment status',
  stateOfOrigin: 'State of origin',
  lgaOfOrigin: 'LGA of origin',
  stateOfResidence: 'State of residence',
  lgaOfResidence: 'LGA of residence',
  'emergencyContact.name': 'Emergency contact name',
  'emergencyContact.phone': 'Emergency contact phone',
  'emergencyContact.relationship': 'Emergency contact relationship',
};

/**
 * Checks whether a beneficiary profile has all required fields filled.
 * Used by the dashboard banner and the application gate.
 */
export function isProfileComplete(profile: BeneficiaryProfile | null | undefined): ProfileCompletion {
  if (!profile) {
    return { isComplete: false, missingFields: Object.values(MISSING_LABELS), completionPercent: 0 };
  }

  const missing: string[] = [];

  if (!profile.dateOfBirth) missing.push(MISSING_LABELS['dateOfBirth']);
  if (!profile.address) missing.push(MISSING_LABELS['address']);
  if (!profile.highestEducation) missing.push(MISSING_LABELS['highestEducation']);
  if (!profile.employmentStatus) missing.push(MISSING_LABELS['employmentStatus']);
  if (!profile.stateOfOrigin) missing.push(MISSING_LABELS['stateOfOrigin']);
  if (!profile.lgaOfOrigin) missing.push(MISSING_LABELS['lgaOfOrigin']);
  if (!profile.stateOfResidence) missing.push(MISSING_LABELS['stateOfResidence']);
  if (!profile.lgaOfResidence) missing.push(MISSING_LABELS['lgaOfResidence']);
  if (!profile.emergencyContact?.name) missing.push(MISSING_LABELS['emergencyContact.name']);
  if (!profile.emergencyContact?.phone) missing.push(MISSING_LABELS['emergencyContact.phone']);
  if (!profile.emergencyContact?.relationship) missing.push(MISSING_LABELS['emergencyContact.relationship']);

  const total = Object.keys(MISSING_LABELS).length;
  const filled = total - missing.length;

  return {
    isComplete: missing.length === 0,
    missingFields: missing,
    completionPercent: Math.round((filled / total) * 100),
  };
}
