'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/context/socket-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Send, Users, Circle } from 'lucide-react';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'file' | 'system';
  timestamp: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface RealTimeChatProps {
  conversationId: string;
  recipientId: string;
  recipientName: string;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  conversationId,
  recipientId,
  recipientName,
}) => {
  const { user } = useAuth();
  const { socket, isConnected, onlineUsers } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isRecipientOnline = onlineUsers.has(recipientId);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/conversation/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !user) return;

    // Join conversation room
    socket.emit('conversation:join', { conversationId });

    // Listen for new messages
    const handleNewMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message = customEvent.detail as Message;
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
        
        // Mark message as read if it's from the other user
        if (message.senderId !== user.id) {
          socket.emit('message:read', {
            conversationId,
            messageId: message._id,
          });
        }
      }
    };

    // Listen for message read updates
    const handleMessageRead = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { conversationId: readConversationId, messageId, readBy } = customEvent.detail;
      if (readConversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? {
                  ...msg,
                  readBy: [...msg.readBy, { userId: readBy, readAt: new Date() }],
                }
              : msg
          )
        );
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { conversationId: typingConversationId, userId, isTyping } = customEvent.detail;
      if (typingConversationId === conversationId && userId === recipientId) {
        setRecipientTyping(isTyping);
      }
    };

    // Add event listeners
    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('messageRead', handleMessageRead);
    window.addEventListener('userTyping', handleUserTyping);

    return () => {
      // Leave conversation room
      socket.emit('conversation:leave', { conversationId });
      
      // Remove event listeners
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('messageRead', handleMessageRead);
      window.removeEventListener('userTyping', handleUserTyping);
    };
  }, [socket, user, conversationId, recipientId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket || !user) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing start
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      socket.emit('message:typing', {
        conversationId,
        isTyping: true,
      });
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit('message:typing', {
          conversationId,
          isTyping: false,
        });
      }
    }, 1000);
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !user) return;

    const messageData = {
      conversationId,
      recipientId,
      content: newMessage.trim(),
      messageType: 'text' as const,
    };

    try {
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        socket.emit('message:typing', {
          conversationId,
          isTyping: false,
        });
      }

      // Send message via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setNewMessage('');
        // Message will be added via socket event
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMessageRead = (message: Message) => {
    return message.readBy.some(read => read.userId === recipientId);
  };

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {recipientName.charAt(0).toUpperCase()}
              </span>
            </div>
            {isRecipientOnline && (
              <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            <div className="flex items-center space-x-2">
              <Badge
                variant={isRecipientOnline ? 'success' : 'secondary'}
                className="text-xs"
              >
                {isRecipientOnline ? 'Online' : 'Offline'}
              </Badge>
              <Badge
                variant={isConnected ? 'success' : 'danger'}
                className="text-xs"
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">{onlineUsers.size} online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.senderId === user?.id && (
                    <span className="text-xs opacity-70">
                      {isMessageRead(message) ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {recipientTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <textarea
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={!isConnected}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isTyping && (
          <p className="text-xs text-gray-500 mt-1">You are typing...</p>
        )}
      </div>
    </Card>
  );
};

export default RealTimeChat;
