import { apiService } from "../api/axios-instance";

export interface CreateFreelancerRequest {
  userId?: string; // Optional, will be set by backend from token
  skills?: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable?: boolean;
  certifications?: string[];
  portfolioLinks?: string[];
  bio?: string;
  title?: string;
  workingHours?: {
    timezone: string;
    availability: {
      [key: string]: { start: string; end: string; available: boolean; };
    };
  };
}

export interface UpdateFreelancerRequest {
  skills?: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable?: boolean;
  certifications?: string[];
  portfolioLinks?: string[];
  bio?: string;
  title?: string;
  workingHours?: {
    timezone: string;
    availability: {
      [key: string]: { start: string; end: string; available: boolean; };
    };
  };
}

export interface FreelancerProfile {
  _id: string;
  userId: string;
  skills: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable: boolean;
  certifications: string[];
  portfolioLinks: string[];
  completedProjects: number;
  bio?: string;
  title?: string;
  workingHours?: {
    timezone: string;
    availability: {
      [key: string]: { start: string; end: string; available: boolean; };
    };
  };
  createdAt: string;
  updatedAt: string;
  // Populated user data
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    rating: number;
    reviewCount: number;
    phoneNumber?: string;
    address?: string;
  };
}

export interface FreelancerQueryParams {
  page?: number;
  limit?: number;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  isAvailable?: boolean;
  search?: string;
  sortBy?: "rating" | "hourlyRate" | "completedProjects" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface FreelancerListResponse {
  data: FreelancerProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const freelancerApi = {
  // Create freelancer profile
  create: async (data: CreateFreelancerRequest): Promise<FreelancerProfile> => {
    const response = await apiService.post("/freelancers", data);
    return response.data as FreelancerProfile;
  },

  // Create freelancer profile or get existing one (safer method)
  createOrGet: async (data: CreateFreelancerRequest): Promise<FreelancerProfile> => {
    if (!data.userId) {
      throw new Error('User ID is required to create a freelancer profile');
    }
    const response = await apiService.post("/freelancers/create-or-get", data);
    return response.data as FreelancerProfile;
  },

  // Get all freelancers with filtering and pagination
  getAll: async (params?: FreelancerQueryParams): Promise<FreelancerListResponse> => {
    const queryString = params ? new URLSearchParams(params as any).toString() : "";
    const url = queryString ? `/freelancers?${queryString}` : "/freelancers";
    const response = await apiService.get(url);
    return response.data as FreelancerListResponse;
  },

  // Get freelancer by ID
  getById: async (id: string): Promise<FreelancerProfile> => {
    const response = await apiService.get(`/freelancers/${id}`);
    return response.data as FreelancerProfile;
  },

  // Get my freelancer profile
  getMyProfile: async (): Promise<FreelancerProfile> => {
    const response = await apiService.get("/freelancers/me");
    return response.data as FreelancerProfile;
  },

  // Get top-rated freelancers
  getTopRated: async (limit = 10): Promise<FreelancerProfile[]> => {
    const response = await apiService.get(`/freelancers/top-rated?limit=${limit}`);
    return response.data as FreelancerProfile[];
  },

  // Update freelancer profile
  update: async (id: string, data: UpdateFreelancerRequest): Promise<FreelancerProfile> => {
    const response = await apiService.patch(`/freelancers/${id}`, data);
    return response.data as FreelancerProfile;
  },

  // Update my freelancer profile
  updateMyProfile: async (data: UpdateFreelancerRequest): Promise<FreelancerProfile> => {
    const response = await apiService.patch("/freelancers/me", data);
    return response.data as FreelancerProfile;
  },

  // Update availability
  updateAvailability: async (id: string, isAvailable: boolean): Promise<FreelancerProfile> => {
    const response = await apiService.patch(`/freelancers/${id}/availability`, { isAvailable });
    return response.data as FreelancerProfile;
  },

  // Update my availability
  updateMyAvailability: async (isAvailable: boolean): Promise<FreelancerProfile> => {
    const response = await apiService.patch("/freelancers/me/availability", { isAvailable });
    return response.data as FreelancerProfile;
  },

  // Delete freelancer profile (Admin only)
  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/freelancers/${id}`);
  },

  // Search freelancers by skills
  searchBySkills: async (skills: string[], limit = 20): Promise<FreelancerProfile[]> => {
    const skillsQuery = skills.map(skill => `skills=${encodeURIComponent(skill)}`).join("&");
    const response = await apiService.get(`/freelancers?${skillsQuery}&limit=${limit}`);
    const responseData = response.data as FreelancerListResponse;
    return responseData?.data || [];
  },

  // Get freelancers by availability
  getAvailable: async (limit = 20): Promise<FreelancerProfile[]> => {
    const response = await apiService.get(`/freelancers?isAvailable=true&limit=${limit}`);
    const responseData = response.data as FreelancerListResponse;
    return responseData?.data || [];
  },

  // Add skills to profile
  addSkills: async (skills: string[]): Promise<FreelancerProfile> => {
    const response = await apiService.post("/freelancers/me/skills", { skills });
    return response.data as FreelancerProfile;
  },

  // Remove skill from profile
  removeSkill: async (skillId: string): Promise<FreelancerProfile> => {
    const response = await apiService.delete(`/freelancers/me/skills/${skillId}`);
    return response.data as FreelancerProfile;
  },

  // Update skills (replace all)
  updateSkills: async (skills: string[]): Promise<FreelancerProfile> => {
    const response = await apiService.put("/freelancers/me/skills", { skills });
    return response.data as FreelancerProfile;
  },

  // Get freelancer dashboard data
  getDashboard: async (): Promise<{
    profile: FreelancerProfile;
    stats: {
      activeProjects: number;
      totalEarnings: number;
      profileViews: number;
      averageRating: number;
      completedProjects: number;
      pendingProposals: number;
    };
    recentActivity: any[];
  }> => {
    const response = await apiService.get("/freelancers/dashboard");
    return response.data as {
      profile: FreelancerProfile;
      stats: {
        activeProjects: number;
        totalEarnings: number;
        profileViews: number;
        averageRating: number;
        completedProjects: number;
        pendingProposals: number;
      };
      recentActivity: any[];
    };
  },

  // Get freelancer analytics
  getAnalytics: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    const response = await apiService.get(`/analytics/my-analytics?period=${period}`);
    return response.data;
  },
};

export default freelancerApi;
