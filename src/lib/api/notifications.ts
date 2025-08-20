import apiClient from "../../api/axios-instance";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'project' | 'payment' | 'message' | 'proposal' | 'contract';
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    projectId?: string;
    proposalId?: string;
    contractId?: string;
    paymentId?: string;
    messageId?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'project' | 'payment' | 'message' | 'proposal' | 'contract';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  type?: string;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface NotificationSettings {
  emailNotifications: {
    projectUpdates: boolean;
    paymentAlerts: boolean;
    messageNotifications: boolean;
    proposalUpdates: boolean;
    contractUpdates: boolean;
    marketingEmails: boolean;
  };
  pushNotifications: {
    projectUpdates: boolean;
    paymentAlerts: boolean;
    messageNotifications: boolean;
    proposalUpdates: boolean;
    contractUpdates: boolean;
  };
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
}

export const notificationApi = {
  // Get all notifications for current user
  getNotifications: async (filters: NotificationFilters = {}): Promise<NotificationListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/notifications?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get notification by ID
  getNotification: async (id: string): Promise<{ success: boolean; data: Notification }> => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data as { success: boolean; data: Notification };
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data as { success: boolean; message: string };
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch('/notifications/mark-all-read');
    return response.data as { success: boolean; message: string };
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Delete all notifications
  deleteAllNotifications: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete('/notifications/all');
    return response.data as { success: boolean; message: string };
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<{ success: boolean; data: { count: number } }> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data as { success: boolean; data: { count: number } };
  },

  // Get notification settings
  getSettings: async (): Promise<{ success: boolean; data: NotificationSettings }> => {
    const response = await apiClient.get('/notifications/settings');
    return response.data as { success: boolean; data: NotificationSettings };
  },

  // Update notification settings
  updateSettings: async (settings: Partial<NotificationSettings>): Promise<{ success: boolean; data: NotificationSettings }> => {
    const response = await apiClient.patch('/notifications/settings', settings);
    return response.data as { success: boolean; data: NotificationSettings };
  },

  // Create notification (admin only)
  createNotification: async (notificationDto: CreateNotificationDto): Promise<{ success: boolean; data: Notification }> => {
    const response = await apiClient.post('/notifications', notificationDto);
    return response.data as { success: boolean; data: Notification };
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription: any): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/notifications/subscribe-push', { subscription });
    return response.data as { success: boolean; message: string };
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/notifications/unsubscribe-push');
    return response.data as { success: boolean; message: string };
  },
};
