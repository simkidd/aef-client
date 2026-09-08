import { api } from '../client';
import {
  ApiResponse,
  LoginPayload,
  LoginResponseData,
  RegisterBeneficiaryPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  User,
} from '@/interfaces';

export const authApi = {
  /** [ADMIN + PORTAL] Authenticate with email/password — returns access + refresh tokens */
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/login', payload);
    return res.data;
  },

  /** [PORTAL] Self-register a new beneficiary account */
  register: async (payload: RegisterBeneficiaryPayload): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  /** [ADMIN + PORTAL] Fetch the currently authenticated user's profile (with populated beneficiaryProfile) */
  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  /** [ADMIN + PORTAL] Request an OTP to be sent to the user's email (password reset flow) */
  sendOtp: async (payload: SendOtpPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/send-otp', payload);
    return res.data;
  },

  /** [ADMIN + PORTAL] Verify the OTP submitted by the user */
  verifyOtp: async (payload: VerifyOtpPayload): Promise<ApiResponse<{ accessToken?: string; message?: string }>> => {
    const res = await api.post('/auth/verify-otp', payload);
    return res.data;
  },

  /** [ADMIN + PORTAL] Reset the authenticated user's password after OTP verification */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data;
  },

  /** [ADMIN + PORTAL] Invalidate the current session / revoke refresh token */
  logout: async (refreshToken?: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/logout', { refreshToken });
    return res.data;
  },

  /** [ADMIN + PORTAL] Exchange a refresh token for a new access token */
  refresh: async (refreshToken: string): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data;
  },

  /** [ADMIN + PORTAL] Update authenticated user profile / contact info */
  updateProfile: async (data: Record<string, any>): Promise<ApiResponse<any>> => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  /** [ADMIN + PORTAL] Change password for authenticated user */
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> => {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};
