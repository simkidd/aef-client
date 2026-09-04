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
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterBeneficiaryPayload): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  sendOtp: async (payload: SendOtpPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/send-otp', payload);
    return res.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<ApiResponse<{ accessToken?: string; message?: string }>> => {
    const res = await api.post('/auth/verify-otp', payload);
    return res.data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data;
  },

  logout: async (refreshToken?: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post('/auth/logout', { refreshToken });
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<LoginResponseData>> => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data;
  },
};
