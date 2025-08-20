import apiClient from "../../api/axios-instance";

export enum UserRole {
  FREELANCER = 'freelancer',
  CLIENT = 'client',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface FreelancerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Freelancer specific fields
  skills?: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable?: boolean;
  certifications?: string[];
  portfolioLinks?: string[];
  completedProjects?: number;
}

export interface FreelancerFilters {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  location?: string;
  availability?: boolean;
  categories?: string[];
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'rating' | 'hourlyRate' | 'completedProjects' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  role?: UserRole;
}

export interface CreateFreelancerDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePicture?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  role: UserRole;
  skills?: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable?: boolean;
  certifications?: string[];
  portfolioLinks?: string[];
}

export interface UpdateFreelancerDto extends Partial<Omit<CreateFreelancerDto, 'email' | 'password'>> {}

export interface FreelancerListResponse {
  users: FreelancerProfile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export const freelancerApi = {
  // Get all freelancers with pagination and filters
  getFreelancers: async (filters: FreelancerFilters = {}): Promise<FreelancerListResponse> => {
    const params = new URLSearchParams();
    
    // Add role=freelancer by default
    params.append('role', UserRole.FREELANCER);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data as FreelancerListResponse;
  },

  // Get single freelancer by ID
  getFreelancer: async (id: string): Promise<FreelancerProfile> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data as FreelancerProfile;
  },

  // Create freelancer profile (user registration)
  createFreelancerProfile: async (data: CreateFreelancerDto): Promise<FreelancerProfile> => {
    const response = await apiClient.post('/users', data);
    return response.data as FreelancerProfile;
  },

  // Update freelancer profile
  updateFreelancerProfile: async (id: string, data: UpdateFreelancerDto): Promise<FreelancerProfile> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data as FreelancerProfile;
  },

  // Get freelancer reviews
  getFreelancerReviews: async (freelancerId: string, page = 1, limit = 10) => {
    const response = await apiClient.get(`/reviews?reviewee=${freelancerId}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get freelancer review stats
  getFreelancerReviewStats: async (freelancerId: string) => {
    const response = await apiClient.get(`/reviews/stats/${freelancerId}`);
    return response.data;
  },

  // Search freelancers
  searchFreelancers: async (query: string, filters: FreelancerFilters = {}): Promise<FreelancerListResponse> => {
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('role', UserRole.FREELANCER);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data as FreelancerListResponse;
  },

  // Get featured freelancers
  getFeaturedFreelancers: async (limit = 8): Promise<FreelancerProfile[]> => {
    const response = await apiClient.get(`/users?role=${UserRole.FREELANCER}&featured=true&limit=${limit}`);
    return ((response.data as any).users || response.data) as FreelancerProfile[];
  },

  // Get freelancer by email
  getFreelancerByEmail: async (email: string): Promise<FreelancerProfile> => {
    const response = await apiClient.get(`/users/email/${email}`);
    return response.data as FreelancerProfile;
  },

  // Check freelancer availability (placeholder - not implemented in backend yet)
  checkAvailability: async (freelancerId: string): Promise<{ isAvailable: boolean; nextAvailable?: string }> => {
    // Since this endpoint doesn't exist in backend, return from user profile
    const freelancer = await freelancerApi.getFreelancer(freelancerId);
    return { 
      isAvailable: freelancer.isAvailable || false,
      nextAvailable: undefined 
    };
  },

  // Update availability (placeholder - not implemented in backend yet)
  updateAvailability: async (freelancerId: string, isAvailable: boolean): Promise<void> => {
    // Update through the general user update endpoint
    await apiClient.put(`/users/${freelancerId}`, { isAvailable });
  },

  // Get similar freelancers (placeholder implementation)
  getSimilarFreelancers: async (freelancerId: string, limit = 4): Promise<FreelancerProfile[]> => {
    // Get the freelancer's skills to find similar ones
    const freelancer = await freelancerApi.getFreelancer(freelancerId);
    const filters: FreelancerFilters = {
      skills: freelancer.skills,
      limit,
      page: 1
    };
    
    const response = await freelancerApi.getFreelancers(filters);
    // Filter out the current freelancer and return up to limit
    return response.users.filter(f => f._id !== freelancerId).slice(0, limit);
  }
};
