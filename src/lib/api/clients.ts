import apiClient from "../../api/axios-instance";

export interface Client {
  _id: string;
  userId: string;
  companyName?: string;
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  description?: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  contactInfo?: {
    email: string;
    phone?: string;
    preferredContactMethod: 'email' | 'phone' | 'platform';
  };
  paymentMethods: {
    type: 'credit_card' | 'paypal' | 'bank_transfer';
    isDefault: boolean;
    details: any;
  }[];
  projectsPosted: number;
  totalSpent: number;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationDocuments?: string[];
  preferredCategories: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  timeline?: {
    typical: number; // in days
    urgent: number; // in days
  };
  workingHours?: {
    timezone: string;
    schedule: {
      [key: string]: {
        start: string;
        end: string;
        available: boolean;
      };
    };
  };
  communicationPreferences?: {
    frequency: 'daily' | 'weekly' | 'milestone' | 'as_needed';
    methods: ('email' | 'chat' | 'video' | 'phone')[];
  };
  successfulProjects: number;
  cancelledProjects: number;
  activeProjects: number;
  totalHired: number;
  repeatHireRate: number;
  averageProjectValue: number;
  lastActiveAt: Date;
  memberSince: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
}

export interface CreateClientDto {
  userId?: string;
  companyName?: string;
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  description?: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  contactInfo?: {
    email: string;
    phone?: string;
    preferredContactMethod: 'email' | 'phone' | 'platform';
  };
  preferredCategories?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  timeline?: {
    typical: number;
    urgent: number;
  };
  workingHours?: {
    timezone: string;
    schedule: {
      [key: string]: {
        start: string;
        end: string;
        available: boolean;
      };
    };
  };
  communicationPreferences?: {
    frequency: 'daily' | 'weekly' | 'milestone' | 'as_needed';
    methods: ('email' | 'chat' | 'video' | 'phone')[];
  };
}

export interface UpdateClientDto extends Partial<Omit<CreateClientDto, 'userId'>> {}

export interface ClientFilters {
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location?: string;
  minRating?: number;
  minProjects?: number;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientListResponse {
  success: boolean;
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientStats {
  totalClients: number;
  verifiedClients: number;
  activeClients: number;
  totalSpent: number;
  averageProjectValue: number;
  averageRating: number;
  topIndustries: { industry: string; count: number }[];
  projectsPostedThisMonth: number;
  repeatClientRate: number;
}

export const clientApi = {
  // Get all clients with filters
  getClients: async (filters: ClientFilters = {}): Promise<ClientListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/clients?${params.toString()}`);
    return response.data as ClientListResponse;
  },

  // Get client by ID
  getClient: async (id: string): Promise<{ success: boolean; data: Client }> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data as { success: boolean; data: Client };
  },

  // Get current user's client profile
  getMyProfile: async (): Promise<{ success: boolean; data: Client }> => {
    const response = await apiClient.get('/clients/me');
    return response.data as { success: boolean; data: Client };
  },

  // Create client profile
  createProfile: async (clientData: CreateClientDto): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.post('/clients', clientData);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Update client profile
  updateProfile: async (id: string, clientData: UpdateClientDto): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch(`/clients/${id}`, clientData);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Update own profile
  updateMyProfile: async (clientData: UpdateClientDto): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch('/clients/me', clientData);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Delete client profile
  deleteProfile: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Get top-rated clients
  getTopRated: async (limit: number = 10): Promise<{ success: boolean; data: Client[] }> => {
    const response = await apiClient.get(`/clients/top-rated?limit=${limit}`);
    return response.data as { success: boolean; data: Client[] };
  },

  // Get clients by industry
  getByIndustry: async (industry: string, limit: number = 10): Promise<{ success: boolean; data: Client[] }> => {
    const response = await apiClient.get(`/clients/industry/${encodeURIComponent(industry)}?limit=${limit}`);
    return response.data as { success: boolean; data: Client[] };
  },

  // Add payment method
  addPaymentMethod: async (id: string, paymentMethod: {
    type: 'credit_card' | 'paypal' | 'bank_transfer';
    details: any;
    isDefault?: boolean;
  }): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.post(`/clients/${id}/payment-methods`, paymentMethod);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Update payment method
  updatePaymentMethod: async (id: string, paymentMethodId: string, paymentMethod: {
    details?: any;
    isDefault?: boolean;
  }): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch(`/clients/${id}/payment-methods/${paymentMethodId}`, paymentMethod);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Remove payment method
  removePaymentMethod: async (id: string, paymentMethodId: string): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.delete(`/clients/${id}/payment-methods/${paymentMethodId}`);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Verify client
  verifyClient: async (id: string, verificationData: {
    documents: string[];
    verifiedBy: string;
  }): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch(`/clients/${id}/verify`, verificationData);
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Update completed projects count
  updateCompletedProjects: async (id: string, count: number): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch(`/clients/${id}/completed-projects`, { count });
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Update total spent
  updateTotalSpent: async (id: string, amount: number): Promise<{ success: boolean; data: Client; message: string }> => {
    const response = await apiClient.patch(`/clients/${id}/total-spent`, { amount });
    return response.data as { success: boolean; data: Client; message: string };
  },

  // Get client statistics
  getClientStats: async (id?: string): Promise<{ success: boolean; data: ClientStats }> => {
    const endpoint = id ? `/clients/stats/${id}` : '/clients/stats';
    const response = await apiClient.get(endpoint);
    return response.data as { success: boolean; data: ClientStats };
  },

  // Get client projects
  getClientProjects: async (id: string, filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data: any[] }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/clients/${id}/projects?${params.toString()}`);
    return response.data as { success: boolean; data: any[] };
  },

  // Get my projects
  getMyProjects: async (filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data: any[] }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/clients/me/projects?${params.toString()}`);
    return response.data as { success: boolean; data: any[] };
  },

  // Search clients
  searchClients: async (query: string, filters: Omit<ClientFilters, 'search'> = {}): Promise<ClientListResponse> => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/clients/search?${params.toString()}`);
    return response.data as ClientListResponse;
  },
};
