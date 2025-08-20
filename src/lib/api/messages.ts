import apiClient from "../../api/axios-instance";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'system';
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  readAt?: Date;
  editedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  receiver?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface Conversation {
  _id: string;
  participants: string[];
  projectId?: string;
  contractId?: string;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  participantDetails?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isOnline?: boolean;
  }[];
  project?: {
    _id: string;
    title: string;
  };
}

export interface SendMessageDto {
  receiverId?: string;
  conversationId?: string;
  content: string;
  messageType?: 'text' | 'file' | 'image';
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  projectId?: string;
}

export interface UpdateMessageDto {
  content?: string;
  readAt?: Date;
}

export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  receiverId?: string;
  messageType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ConversationFilters {
  projectId?: string;
  isArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  totalPages: number;
}

export const messageApi = {
  // Get all conversations
  getConversations: async (filters: ConversationFilters = {}): Promise<ConversationListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/messages/conversations?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get conversation by ID
  getConversation: async (id: string): Promise<{ success: boolean; data: Conversation }> => {
    const response = await apiClient.get(`/messages/conversations/${id}`);
    return response.data as { success: boolean; data: Conversation };
  },

  // Get messages in a conversation
  getMessages: async (conversationId: string, filters: Omit<MessageFilters, 'conversationId'> = {}): Promise<MessageListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/messages/conversations/${conversationId}/messages?${params.toString()}`);
    return (response.data as any).data;
  },

  // Send message
  sendMessage: async (messageDto: SendMessageDto): Promise<{ success: boolean; data: Message }> => {
    const response = await apiClient.post('/messages', messageDto);
    return response.data as { success: boolean; data: Message };
  },

  // Update message (mark as read, edit)
  updateMessage: async (id: string, updateDto: UpdateMessageDto): Promise<{ success: boolean; data: Message }> => {
    const response = await apiClient.patch(`/messages/${id}`, updateDto);
    return response.data as { success: boolean; data: Message };
  },

  // Delete message
  deleteMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/messages/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/messages/conversations/${conversationId}/read`);
    return response.data as { success: boolean; message: string };
  },

  // Archive conversation
  archiveConversation: async (conversationId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/messages/conversations/${conversationId}/archive`);
    return response.data as { success: boolean; message: string };
  },

  // Unarchive conversation
  unarchiveConversation: async (conversationId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/messages/conversations/${conversationId}/unarchive`);
    return response.data as { success: boolean; message: string };
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ success: boolean; data: { count: number } }> => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data as { success: boolean; data: { count: number } };
  },

  // Search messages
  searchMessages: async (query: string, filters: MessageFilters = {}): Promise<MessageListResponse> => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'search') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/messages/search?${params.toString()}`);
    return (response.data as any).data;
  },

  // Create or get conversation with user
  getOrCreateConversation: async (userId: string, projectId?: string): Promise<{ success: boolean; data: Conversation }> => {
    const body: any = { userId };
    if (projectId) body.projectId = projectId;
    
    const response = await apiClient.post('/messages/conversations/get-or-create', body);
    return response.data as { success: boolean; data: Conversation };
  },
};
