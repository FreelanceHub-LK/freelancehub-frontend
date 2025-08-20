import apiClient from "../../api/axios-instance";
import { cache, cacheKeys } from '../cache';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'freelancer' | 'client';
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      profilePicture?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export const authApi = {
  // Authentication endpoints
  login: async (loginDto: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', loginDto);
    const authData = response.data as AuthResponse;
    
    // Cache user profile after successful login
    if (authData.success && authData.data.user) {
      cache.set(cacheKeys.profile(authData.data.user._id), authData.data.user, 10 * 60 * 1000); // 10 min
    }
    
    return authData;
  },

  register: async (registerDto: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', registerDto);
    return response.data as AuthResponse;
  },

  refreshToken: async (refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', refreshTokenDto);
    return response.data as AuthResponse;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    // Clear all cache on logout
    cache.clear();
    return response.data as { success: boolean; message: string };
  },

  // OTP endpoints
  sendOtp: async (sendOtpDto: SendOtpDto): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/send-otp', sendOtpDto);
    return response.data as { success: boolean; message: string };
  },

  verifyOtp: async (verifyOtpDto: VerifyOtpDto): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/verify-otp', verifyOtpDto);
    return response.data as { success: boolean; message: string };
  },

  resendOtp: async (sendOtpDto: SendOtpDto): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/resend-otp', sendOtpDto);
    return response.data as { success: boolean; message: string };
  },

  // Password reset
  forgotPassword: async (forgotPasswordDto: ForgotPasswordDto): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', forgotPasswordDto);
    return response.data as { success: boolean; message: string };
  },

  resetPassword: async (resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/reset-password', resetPasswordDto);
    return response.data as { success: boolean; message: string };
  },

  // Google Auth
  googleAuth: async (): Promise<{ url: string }> => {
    const response = await apiClient.get('/auth/google');
    return response.data as { url: string };
  },

  // Profile
  getProfile: async (): Promise<any> => {
    const response = await apiClient.get('/auth/profile');
    const profileData = response.data as any;
    
    // Cache the profile data
    if (profileData?.data?._id) {
      cache.set(cacheKeys.profile(profileData.data._id), profileData.data, 10 * 60 * 1000); // 10 min
    }
    
    return profileData;
  },

  // Check auth status
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user?: any }> => {
    try {
      const response = await apiClient.get('/auth/profile');
      const responseData = response.data as any;
      
      // Cache user data if authenticated
      if (responseData?.data?._id) {
        cache.set(cacheKeys.profile(responseData.data._id), responseData.data, 10 * 60 * 1000);
      }
      
      return { isAuthenticated: true, user: responseData.data };
    } catch (error) {
      return { isAuthenticated: false };
    }
  },
};
