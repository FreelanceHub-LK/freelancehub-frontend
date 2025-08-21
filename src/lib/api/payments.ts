import apiClient from "../../api/axios-instance";

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  type: 'project_payment' | 'milestone_payment' | 'escrow_release' | 'refund' | 'withdrawal';
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'wallet';
  recipient: string;
  project?: string;
  contract?: string;
  description?: string;
  escrowDetails?: {
    isEscrow: boolean;
    escrowReleaseConditions?: string[];
    milestoneId?: string;
    autoReleaseEnabled?: boolean;
    autoReleaseDays?: number;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  payment: Payment;
  redirectUrl?: string;
  clientSecret?: string;
  status: string;
  message: string;
}

export interface Payment {
  _id: string;
  amount: number;
  currency: string;
  type: 'project_payment' | 'milestone_payment' | 'refund' | 'withdrawal' | 'platform_fee';
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payerId: string;
  recipientId: string;
  projectId?: string;
  contractId?: string;
  description: string;
  
  // Escrow details
  escrowDetails?: {
    isEscrow: boolean;
    releaseConditions?: string[];
    autoReleaseEnabled?: boolean;
    autoReleaseDays?: number;
    releasedAt?: Date;
    releasedBy?: string;
  };
  
  // Payment gateway details
  gatewayPaymentId?: string;
  gatewayResponse?: any;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Refund details
  refundDetails?: {
    originalPaymentId: string;
    refundAmount: number;
    reason: string;
    refundedAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  payer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  recipient?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    _id: string;
    title: string;
  };
}

export interface CreatePaymentDto {
  amount: number;
  currency: string;
  type: 'project_payment' | 'milestone_payment' | 'refund' | 'withdrawal' | 'platform_fee';
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'wallet';
  payerId: string;
  recipientId: string;
  projectId?: string;
  contractId?: string;
  description: string;
  escrowDetails?: {
    isEscrow: boolean;
    releaseConditions?: string[];
    autoReleaseEnabled?: boolean;
    autoReleaseDays?: number;
  };
  metadata?: Record<string, any>;
}

export interface UpdatePaymentDto extends Partial<Omit<CreatePaymentDto, 'payerId' | 'recipientId'>> {}

export interface PaymentFilters {
  type?: string;
  method?: string;
  status?: string;
  payerId?: string;
  recipientId?: string;
  projectId?: string;
  contractId?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaymentStats {
  totalEarnings: number;
  totalPayments: number;
  pendingAmount: number;
  completedPayments: number;
  escrowAmount: number;
  monthlyEarnings: {
    month: string;
    amount: number;
  }[];
  paymentsByMethod: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export interface RefundDto {
  paymentId: string;
  refundAmount: number;
  reason: string;
}

export interface EscrowReleaseDto {
  paymentId: string;
  reason: string;
}

export interface WithdrawDto {
  amount: number;
  currency: string;
  withdrawalMethod: 'bank_account' | 'paypal' | 'stripe';
  details: string;
}

export const paymentApi = {
  // Get all payments with filters
  getPayments: async (filters: PaymentFilters = {}): Promise<PaymentListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/payments?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get payment by ID
  getPayment: async (id: string): Promise<{ success: boolean; data: Payment }> => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data as { success: boolean; data: Payment };
  },

  // Create new payment
  createPayment: async (paymentDto: CreatePaymentDto): Promise<{ success: boolean; data: Payment }> => {
    const response = await apiClient.post('/payments', paymentDto);
    return response.data as { success: boolean; data: Payment };
  },

  // Update payment
  updatePayment: async (id: string, updateDto: UpdatePaymentDto): Promise<{ success: boolean; data: Payment }> => {
    const response = await apiClient.patch(`/payments/${id}`, updateDto);
    return response.data as { success: boolean; data: Payment };
  },

  // Get payment statistics
  getPaymentStats: async (userId?: string): Promise<{ success: boolean; data: PaymentStats }> => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.get(`/payments/stats${params}`);
    return response.data as { success: boolean; data: PaymentStats };
  },

  // Process refund
  refundPayment: async (refundDto: RefundDto): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.post('/payments/refund', refundDto);
    return response.data as { success: boolean; message: string; data?: any };
  },

  // Release escrow
  releaseEscrow: async (escrowDto: EscrowReleaseDto): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.post('/payments/escrow/release', escrowDto);
    return response.data as { success: boolean; message: string; data?: any };
  },

  // Withdraw funds
  withdraw: async (withdrawDto: WithdrawDto): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.post('/payments/withdraw', withdrawDto);
    return response.data as { success: boolean; message: string; data?: any };
  },

  // Get related payments
  getRelatedPayments: async (id: string): Promise<{ success: boolean; data: Payment[] }> => {
    const response = await apiClient.get(`/payments/${id}/related`);
    return response.data as { success: boolean; data: Payment[] };
  },

  // Get user's payment history
  getUserPayments: async (userId: string, filters: PaymentFilters = {}): Promise<PaymentListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/payments/user/${userId}?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get project payments
  getProjectPayments: async (projectId: string): Promise<{ success: boolean; data: Payment[] }> => {
    const response = await apiClient.get(`/payments/project/${projectId}`);
    return response.data as { success: boolean; data: Payment[] };
  },

  // Capture PayPal payment
  capturePayPalPayment: async (paymentId: string, paypalOrderId: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.post(`/payments/paypal/capture/${paymentId}`, { paypalOrderId });
    return response.data as { success: boolean; message: string; data?: any };
  },

  // Cancel payment
  cancelPayment: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch(`/payments/${id}/cancel`);
    return response.data as { success: boolean; message: string };
  },
};
