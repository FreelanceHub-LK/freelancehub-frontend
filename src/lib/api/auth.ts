import { apiService } from "../../api/axios-instance";
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
  role?: 'freelancer' | 'client' | 'admin';
  location?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: 'freelancer' | 'client' | 'admin';
  profilePicture?: string;
  accessToken: string;
  refreshToken?: string;
  passkeyEnabled?: boolean;
  passkeyCount?: number;
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
    const response = await apiService.post('/auth/login', loginDto);
    const authData = response.data as AuthResponse;
    
    // Cache user profile after successful login
    if (authData.id) {
      cache.set(cacheKeys.profile(authData.id), authData, 10 * 60 * 1000); // 10 min
    }
    
    return authData;
  },

  register: async (registerDto: RegisterDto): Promise<AuthResponse> => {
    const response = await apiService.post('/auth/register', registerDto);
    return response.data as AuthResponse;
  },

  refreshToken: async (refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> => {
    const response = await apiService.post('/auth/refresh-token', refreshTokenDto);
    return response.data as AuthResponse;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/logout');
    // Clear all cache on logout
    cache.clear();
    return response.data as { message: string };
  },

  // OTP endpoints
  sendOtp: async (sendOtpDto: SendOtpDto): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/send-otp', sendOtpDto);
    return response.data as { message: string };
  },

  verifyOtp: async (verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/verify-otp', verifyOtpDto);
    return response.data as { message: string };
  },

  resendOtp: async (sendOtpDto: SendOtpDto): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/resend-otp', sendOtpDto);
    return response.data as { message: string };
  },

  // Password reset
  forgotPassword: async (forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/forgot-password', forgotPasswordDto);
    return response.data as { message: string };
  },

  resetPassword: async (resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> => {
    const response = await apiService.post('/auth/reset-password', resetPasswordDto);
    return response.data as { message: string };
  },

  // Google Auth
  googleAuth: (): void => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${backendUrl}/auth/google`;
  },

  googleLoginDirect: async (googleUser: any): Promise<AuthResponse> => {
    const response = await apiService.post('/auth/google/login', googleUser);
    return response.data as AuthResponse;
  },

  // Profile
  getProfile: async (): Promise<AuthResponse> => {
    const response = await apiService.get('/auth/me');
    const profileData = response.data as AuthResponse;
    
    // Cache the profile data
    if (profileData?.id) {
      cache.set(cacheKeys.profile(profileData.id), profileData, 10 * 60 * 1000); // 10 min
    }
    
    return profileData;
  },

  // Check auth status
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user?: AuthResponse }> => {
    try {
      const response = await apiService.get('/auth/me');
      const responseData = response.data as AuthResponse;
      
      // Cache user data if authenticated
      if (responseData?.id) {
        cache.set(cacheKeys.profile(responseData.id), responseData, 10 * 60 * 1000);
      }
      
      return { isAuthenticated: true, user: responseData };
    } catch (error) {
      return { isAuthenticated: false };
    }
  },
};
