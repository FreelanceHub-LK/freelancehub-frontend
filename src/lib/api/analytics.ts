import apiClient from "../../api/axios-instance";

export interface Analytics {
  userStats: {
    totalUsers: number;
    totalFreelancers: number;
    totalClients: number;
    newUsersThisMonth: number;
    activeUsers: number;
  };
  projectStats: {
    totalProjects: number;
    openProjects: number;
    completedProjects: number;
    averageProjectValue: number;
    projectsThisMonth: number;
  };
  financialStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageTransactionValue: number;
    totalTransactions: number;
    platformFees: number;
  };
  performanceMetrics: {
    averageCompletionTime: number;
    customerSatisfactionRate: number;
    freelancerRetentionRate: number;
    clientRetentionRate: number;
  };
  recentActivity: {
    date: string;
    users: number;
    projects: number;
    revenue: number;
  }[];
}

export interface UserAnalytics {
  profileViews: number;
  projectsCompleted: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
  recentProjects: {
    title: string;
    completedAt: Date;
    earnings: number;
    rating?: number;
  }[];
  earningsHistory: {
    month: string;
    earnings: number;
  }[];
  skillsPerformance: {
    skill: string;
    projects: number;
    averageRating: number;
    earnings: number;
  }[];
}

export interface ProjectAnalytics {
  totalViews: number;
  totalProposals: number;
  averageProposalAmount: number;
  proposalRange: {
    min: number;
    max: number;
  };
  freelancerInterest: {
    location: string;
    count: number;
  }[];
  skillDemand: {
    skill: string;
    demand: number;
  }[];
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
  userId?: string;
  projectId?: string;
}

export const analyticsApi = {
  // Get platform analytics (admin only)
  getPlatformAnalytics: async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: Analytics }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/platform?${params.toString()}`);
    return response.data as { success: boolean; data: Analytics };
  },

  // Get user analytics (freelancer/client dashboard)
  getUserAnalytics: async (userId?: string, filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: UserAnalytics }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const endpoint = userId ? `/analytics/user/${userId}` : '/analytics/user/me';
    const response = await apiClient.get(`${endpoint}?${params.toString()}`);
    return response.data as { success: boolean; data: UserAnalytics };
  },

  // Get project analytics
  getProjectAnalytics: async (projectId: string, filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: ProjectAnalytics }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/project/${projectId}?${params.toString()}`);
    return response.data as { success: boolean; data: ProjectAnalytics };
  },

  // Get earnings analytics
  getEarningsAnalytics: async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: any }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/earnings?${params.toString()}`);
    return response.data as { success: boolean; data: any };
  },

  // Get skill analytics
  getSkillAnalytics: async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: any }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/skills?${params.toString()}`);
    return response.data as { success: boolean; data: any };
  },

  // Get market trends
  getMarketTrends: async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: any }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/market-trends?${params.toString()}`);
    return response.data as { success: boolean; data: any };
  },

  // Get performance metrics
  getPerformanceMetrics: async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: any }> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/analytics/performance?${params.toString()}`);
    return response.data as { success: boolean; data: any };
  },
};
