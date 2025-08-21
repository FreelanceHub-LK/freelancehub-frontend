'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'system';
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (message: Omit<Message, '_id' | 'createdAt' | 'updatedAt'>) => void;
  markAsRead: (conversationId: string, messageId: string) => void;
  typing: (conversationId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      // Get token from localStorage
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        console.warn('No access token found for socket connection');
        return;
      }

      // Initialize socket connection
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`, {
        auth: {
          token: accessToken,
          userId: user.id,
        },
        transports: ['websocket', 'polling'],
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', (reason: string) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error);
        toast.error('Connection error. Some features may not work properly.');
      });

      // User presence events
      newSocket.on('user:online', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      newSocket.on('user:offline', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      });

      // Message events
      newSocket.on('message:new', (message: Message) => {
        // Handle new message received
        console.log('New message received:', message);
        
        // Show notification if message is not from current user
        if (message.senderId !== user.id) {
          toast.info(
            `New message from ${message.sender?.firstName} ${message.sender?.lastName}`
          );
          
          // Play notification sound
          playNotificationSound();
        }

        // Dispatch custom event for components to listen to
        window.dispatchEvent(new CustomEvent('newMessage', { detail: message }));
      });

      newSocket.on('message:read', ({ conversationId, messageId, readBy }: {
        conversationId: string;
        messageId: string;
        readBy: string;
      }) => {
        // Handle message read status update
        window.dispatchEvent(new CustomEvent('messageRead', { 
          detail: { conversationId, messageId, readBy } 
        }));
      });

      newSocket.on('conversation:updated', (conversation: Conversation) => {
        // Handle conversation updates
        window.dispatchEvent(new CustomEvent('conversationUpdated', { 
          detail: conversation 
        }));
      });

      newSocket.on('user:typing', ({ conversationId, userId, isTyping }: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        // Handle typing indicators
        window.dispatchEvent(new CustomEvent('userTyping', { 
          detail: { conversationId, userId, isTyping } 
        }));
      });

      // Notification events
      newSocket.on('notification:new', (notification: any) => {
        // Handle new notifications
        console.log('New notification:', notification);
        toast.info(notification.message);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
      });

      // Project events
      newSocket.on('project:updated', (project: any) => {
        // Handle project updates
        window.dispatchEvent(new CustomEvent('projectUpdated', { detail: project }));
      });

      newSocket.on('proposal:new', (proposal: any) => {
        // Handle new proposals
        if (proposal.projectId && proposal.freelancerId !== user.id) {
          toast.info('New proposal received for your project');
        }
        window.dispatchEvent(new CustomEvent('newProposal', { detail: proposal }));
      });

      newSocket.on('contract:updated', (contract: any) => {
        // Handle contract updates
        window.dispatchEvent(new CustomEvent('contractUpdated', { detail: contract }));
      });

      // Payment events
      newSocket.on('payment:completed', (payment: any) => {
        // Handle payment completion
        toast.success('Payment completed successfully');
        window.dispatchEvent(new CustomEvent('paymentCompleted', { detail: payment }));
      });

      newSocket.on('payment:failed', (payment: any) => {
        // Handle payment failure
        toast.error('Payment failed. Please try again.');
        window.dispatchEvent(new CustomEvent('paymentFailed', { detail: payment }));
      });

      // Dispute events
      newSocket.on('dispute:new', (dispute: any) => {
        // Handle new disputes
        toast.warning('A new dispute has been created');
        window.dispatchEvent(new CustomEvent('newDispute', { detail: dispute }));
      });

      newSocket.on('dispute:updated', (dispute: any) => {
        // Handle dispute updates
        window.dispatchEvent(new CustomEvent('disputeUpdated', { detail: dispute }));
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      };
    } else {
      // Clean up socket if user is not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      }
    }
  }, [user, toast]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Could not play notification sound:', error);
    }
  };

  const joinConversation = (conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('conversation:join', { conversationId });
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('conversation:leave', { conversationId });
    }
  };

  const sendMessage = (message: Omit<Message, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (socket && isConnected) {
      socket.emit('message:send', message);
    }
  };

  const markAsRead = (conversationId: string, messageId: string) => {
    if (socket && isConnected) {
      socket.emit('message:read', { conversationId, messageId });
    }
  };

  const typing = (conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('user:typing', { conversationId, isTyping });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    markAsRead,
    typing,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

// Custom hooks for specific socket events
export function useSocketEvent(eventName: string, handler: (data: any) => void) {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on(eventName, handler);
      return () => {
        socket.off(eventName, handler);
      };
    }
  }, [socket, eventName, handler]);
}

// Hook for real-time messages
export function useRealTimeMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const message = event.detail as Message;
      setMessages(prev => [...prev, message]);
    };

    const handleConversationUpdated = (event: CustomEvent) => {
      const conversation = event.detail as Conversation;
      setConversations(prev => {
        const index = prev.findIndex(c => c._id === conversation._id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = conversation;
          return updated;
        }
        return [conversation, ...prev];
      });
    };

    window.addEventListener('newMessage', handleNewMessage as EventListener);
    window.addEventListener('conversationUpdated', handleConversationUpdated as EventListener);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage as EventListener);
      window.removeEventListener('conversationUpdated', handleConversationUpdated as EventListener);
    };
  }, []);

  return { messages, conversations };
}

// Hook for typing indicators
export function useTypingIndicator(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleUserTyping = (event: CustomEvent) => {
      const { conversationId: eventConversationId, userId, isTyping } = event.detail;
      
      if (eventConversationId === conversationId) {
        setTypingUsers(prev => {
          const updated = new Set(prev);
          if (isTyping) {
            updated.add(userId);
          } else {
            updated.delete(userId);
          }
          return updated;
        });
      }
    };

    window.addEventListener('userTyping', handleUserTyping as EventListener);

    return () => {
      window.removeEventListener('userTyping', handleUserTyping as EventListener);
    };
  }, [conversationId]);

  return Array.from(typingUsers);
}
