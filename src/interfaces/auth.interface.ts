import { User } from './user.interface';

export interface LoginPayload {
  email: string;
  password?: string;
  otp?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterBeneficiaryPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  stateOfOrigin?: string;
  lgaOfOrigin?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  highestEducation?: string;
  employmentStatus?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface SendOtpPayload {
  email: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'VERIFY_EMAIL' | 'ENROLLMENT';
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'VERIFY_EMAIL' | 'ENROLLMENT';
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword?: string;
  confirmPassword?: string;
}
