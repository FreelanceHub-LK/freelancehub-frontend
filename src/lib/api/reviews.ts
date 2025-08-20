import apiClient from "../../api/axios-instance";

export interface Review {
  _id: string;
  reviewerId: string;
  revieweeId: string;
  projectId: string;
  contractId: string;
  rating: number; // 1-5
  comment: string;
  reviewType: 'client_to_freelancer' | 'freelancer_to_client';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  reviewer?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  reviewee?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  project?: {
    _id: string;
    title: string;
  };
}

export interface CreateReviewDto {
  revieweeId: string;
  projectId: string;
  contractId: string;
  rating: number;
  comment: string;
  reviewType: 'client_to_freelancer' | 'freelancer_to_client';
  isPublic?: boolean;
}

export interface UpdateReviewDto extends Partial<Omit<CreateReviewDto, 'revieweeId' | 'projectId' | 'contractId' | 'reviewType'>> {}

export interface ReviewFilters {
  reviewerId?: string;
  revieweeId?: string;
  projectId?: string;
  contractId?: string;
  reviewType?: string;
  minRating?: number;
  maxRating?: number;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  averageRating?: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  recentReviews: Review[];
}

export const reviewApi = {
  // Get all reviews with filters
  getReviews: async (filters: ReviewFilters = {}): Promise<ReviewListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reviews?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get review by ID
  getReview: async (id: string): Promise<{ success: boolean; data: Review }> => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data as { success: boolean; data: Review };
  },

  // Create new review
  createReview: async (reviewDto: CreateReviewDto): Promise<{ success: boolean; data: Review }> => {
    const response = await apiClient.post('/reviews', reviewDto);
    return response.data as { success: boolean; data: Review };
  },

  // Update review
  updateReview: async (id: string, updateDto: UpdateReviewDto): Promise<{ success: boolean; data: Review }> => {
    const response = await apiClient.patch(`/reviews/${id}`, updateDto);
    return response.data as { success: boolean; data: Review };
  },

  // Delete review
  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Get reviews for a user (as reviewee)
  getUserReviews: async (userId: string, filters: Omit<ReviewFilters, 'revieweeId'> = {}): Promise<ReviewListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reviews/user/${userId}?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get reviews by a user (as reviewer)
  getReviewsByUser: async (userId: string, filters: Omit<ReviewFilters, 'reviewerId'> = {}): Promise<ReviewListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reviews/by-user/${userId}?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get project reviews
  getProjectReviews: async (projectId: string): Promise<{ success: boolean; data: Review[] }> => {
    const response = await apiClient.get(`/reviews/project/${projectId}`);
    return response.data as { success: boolean; data: Review[] };
  },

  // Get review statistics for a user
  getUserReviewStats: async (userId: string): Promise<{ success: boolean; data: ReviewStats }> => {
    const response = await apiClient.get(`/reviews/user/${userId}/stats`);
    return response.data as { success: boolean; data: ReviewStats };
  },

  // Check if user can review a project
  canReview: async (projectId: string, contractId: string): Promise<{ success: boolean; data: { canReview: boolean; reason?: string } }> => {
    const response = await apiClient.get(`/reviews/can-review?projectId=${projectId}&contractId=${contractId}`);
    return response.data as { success: boolean; data: { canReview: boolean; reason?: string } };
  },
};
