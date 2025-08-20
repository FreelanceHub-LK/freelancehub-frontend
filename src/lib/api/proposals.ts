import apiClient from "../../api/axios-instance";

export interface Proposal {
  _id: string;
  projectId: string;
  freelancerId: string;
  clientId: string;
  coverLetter: string;
  bidAmount: number;
  currency: string;
  deliveryTime: number; // in days
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  attachments?: string[];
  milestones?: {
    title: string;
    description: string;
    amount: number;
    deliveryDate: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  project?: {
    _id: string;
    title: string;
    status: string;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
  };
  freelancer?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating: number;
    completedProjects: number;
    skills: string[];
  };
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface CreateProposalDto {
  projectId: string;
  coverLetter: string;
  bidAmount: number;
  currency: string;
  deliveryTime: number;
  attachments?: string[];
  milestones?: {
    title: string;
    description: string;
    amount: number;
    deliveryDate: string;
  }[];
}

export interface UpdateProposalDto extends Partial<Omit<CreateProposalDto, 'projectId'>> {}

export interface ProposalFilters {
  projectId?: string;
  freelancerId?: string;
  clientId?: string;
  status?: string;
  minBid?: number;
  maxBid?: number;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'bidAmount' | 'deliveryTime';
  sortOrder?: 'asc' | 'desc';
}

export interface ProposalListResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  totalPages: number;
}

export const proposalApi = {
  // Get all proposals with filters
  getProposals: async (filters: ProposalFilters = {}): Promise<ProposalListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/proposals?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get proposal by ID
  getProposal: async (id: string): Promise<{ success: boolean; data: Proposal }> => {
    const response = await apiClient.get(`/proposals/${id}`);
    return response.data as { success: boolean; data: Proposal };
  },

  // Create new proposal
  createProposal: async (proposalDto: CreateProposalDto): Promise<{ success: boolean; data: Proposal }> => {
    const response = await apiClient.post('/proposals', proposalDto);
    return response.data as { success: boolean; data: Proposal };
  },

  // Update proposal
  updateProposal: async (id: string, updateDto: UpdateProposalDto): Promise<{ success: boolean; data: Proposal }> => {
    const response = await apiClient.patch(`/proposals/${id}`, updateDto);
    return response.data as { success: boolean; data: Proposal };
  },

  // Delete/Withdraw proposal
  deleteProposal: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/proposals/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Accept proposal (client)
  acceptProposal: async (id: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.post(`/proposals/${id}/accept`);
    return response.data as { success: boolean; message: string; data?: any };
  },

  // Reject proposal (client)
  rejectProposal: async (id: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/proposals/${id}/reject`, { reason });
    return response.data as { success: boolean; message: string };
  },

  // Get proposals for a project
  getProjectProposals: async (projectId: string, filters: Omit<ProposalFilters, 'projectId'> = {}): Promise<ProposalListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/proposals/project/${projectId}?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get my proposals (freelancer)
  getMyProposals: async (filters: ProposalFilters = {}): Promise<ProposalListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/proposals/my?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get proposals received (client)
  getReceivedProposals: async (filters: ProposalFilters = {}): Promise<ProposalListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/proposals/received?${params.toString()}`);
    return (response.data as any).data;
  },
};
