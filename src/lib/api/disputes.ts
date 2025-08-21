import apiClient from "../../api/axios-instance";

export interface Dispute {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  contractId?: string;
  paymentId?: string;
  claimantId: string;
  respondentId: string;
  status: 'open' | 'in_review' | 'evidence_gathering' | 'arbitration' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'payment' | 'quality' | 'deadline' | 'scope' | 'communication' | 'other';
  amount?: {
    value: number;
    currency: string;
  };
  evidence: {
    description: string;
    attachments: string[];
    submittedBy: string;
    submittedAt: Date;
  }[];
  resolution?: {
    decision: string;
    reasoning: string;
    compensationAmount?: number;
    resolvedBy: string;
    resolvedAt: Date;
  };
  messages: {
    senderId: string;
    message: string;
    isPublic: boolean;
    timestamp: Date;
  }[];
  timeline: {
    action: string;
    description: string;
    performedBy: string;
    timestamp: Date;
  }[];
  assignedMediatorId?: string;
  mediatorNotes?: string;
  autoResolutionDate?: Date;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  claimant?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  respondent?: {
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

export interface CreateDisputeDto {
  title: string;
  description: string;
  projectId: string;
  contractId?: string;
  paymentId?: string;
  respondentId: string;
  category: 'payment' | 'quality' | 'deadline' | 'scope' | 'communication' | 'other';
  amount?: {
    value: number;
    currency: string;
  };
  evidence: {
    description: string;
    attachments?: string[];
  }[];
  isUrgent?: boolean;
}

export interface UpdateDisputeDto {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isUrgent?: boolean;
}

export interface AddEvidenceDto {
  description: string;
  attachments?: string[];
}

export interface AddMessageDto {
  message: string;
  isPublic?: boolean;
}

export interface ResolveDisputeDto {
  decision: string;
  reasoning: string;
  compensationAmount?: number;
}

export interface DisputeFilters {
  status?: 'open' | 'in_review' | 'evidence_gathering' | 'arbitration' | 'resolved' | 'closed';
  category?: 'payment' | 'quality' | 'deadline' | 'scope' | 'communication' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  claimantId?: string;
  respondentId?: string;
  projectId?: string;
  isUrgent?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface DisputeListResponse {
  success: boolean;
  data: Dispute[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DisputeStats {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
  averageResolutionTime: number;
  satisfactionRate: number;
}

export const disputeApi = {
  // Get all disputes with filters
  getDisputes: async (filters: DisputeFilters = {}): Promise<DisputeListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/disputes?${params.toString()}`);
    return response.data as DisputeListResponse;
  },

  // Get dispute by ID
  getDispute: async (id: string): Promise<{ success: boolean; data: Dispute }> => {
    const response = await apiClient.get(`/disputes/${id}`);
    return response.data as { success: boolean; data: Dispute };
  },

  // Create new dispute
  createDispute: async (disputeData: CreateDisputeDto): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.post('/disputes', disputeData);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Update dispute
  updateDispute: async (id: string, disputeData: UpdateDisputeDto): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}`, disputeData);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Delete dispute
  deleteDispute: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/disputes/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Add evidence to dispute
  addEvidence: async (id: string, evidence: AddEvidenceDto): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.post(`/disputes/${id}/evidence`, evidence);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Add message to dispute
  addMessage: async (id: string, message: AddMessageDto): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.post(`/disputes/${id}/messages`, message);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Change dispute status
  updateStatus: async (id: string, status: 'open' | 'in_review' | 'evidence_gathering' | 'arbitration' | 'resolved' | 'closed'): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/status`, { status });
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Assign mediator
  assignMediator: async (id: string, mediatorId: string): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/assign-mediator`, { mediatorId });
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Resolve dispute
  resolveDispute: async (id: string, resolution: ResolveDisputeDto): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/resolve`, resolution);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Escalate dispute
  escalateDispute: async (id: string): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/escalate`);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Get user's disputes
  getUserDisputes: async (userId?: string, filters: DisputeFilters = {}): Promise<DisputeListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const endpoint = userId ? `/disputes/user/${userId}` : '/disputes/me';
    const response = await apiClient.get(`${endpoint}?${params.toString()}`);
    return response.data as DisputeListResponse;
  },

  // Get project disputes
  getProjectDisputes: async (projectId: string): Promise<{ success: boolean; data: Dispute[] }> => {
    const response = await apiClient.get(`/disputes/project/${projectId}`);
    return response.data as { success: boolean; data: Dispute[] };
  },

  // Get dispute statistics
  getDisputeStats: async (userId?: string): Promise<{ success: boolean; data: DisputeStats }> => {
    const endpoint = userId ? `/disputes/stats/${userId}` : '/disputes/stats';
    const response = await apiClient.get(endpoint);
    return response.data as { success: boolean; data: DisputeStats };
  },

  // Close dispute
  closeDispute: async (id: string): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/close`);
    return response.data as { success: boolean; data: Dispute; message: string };
  },

  // Reopen dispute
  reopenDispute: async (id: string): Promise<{ success: boolean; data: Dispute; message: string }> => {
    const response = await apiClient.patch(`/disputes/${id}/reopen`);
    return response.data as { success: boolean; data: Dispute; message: string };
  },
};
