import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatSocketHook {
  socket: Socket | null;
  socketRef: React.MutableRefObject<Socket | null>;
  isConnected: boolean;
  messages: any[];
  /** Broadcast of every message in the system, for admin moderation. */
  moderationMessages: any[];
  sendMessage: (conversationId: string, content: string) => void;
  joinConversation: (conversationId: string) => void;
  typing: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  typingUsers: Set<string>;
  onlineUsers: Record<string, boolean>;
  checkUserStatus: (userId: string) => void;
}

export const useChatSocket = (token?: string): ChatSocketHook => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [moderationMessages, setModerationMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Use environment variable for backend URL if available
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const socketIo = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketIo.on('connect', () => {
      console.log('Socket connected:', socketIo.id);
      setIsConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Without this an invalid or expired token retries forever in the
    // background, silently, with no indication that chat is dead.
    socketIo.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
      if (error.message.includes('jwt expired') || error.message.includes('Unauthorized')) {
        socketIo.disconnect();
      }
    });

    socketIo.on('newMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    // Admin-only moderation broadcast: every message in the system, so the
    // conversation list and notifications update for threads the admin has not
    // opened (and is not a participant in).
    socketIo.on('moderationMessage', (data: any) => {
      setModerationMessages((prev) => [...prev.slice(-199), data]);
    });

    socketIo.on('userTyping', (data: any) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.add(data.userId);
        return newSet;
      });
    });

    socketIo.on('userStoppedTyping', (data: any) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socketIo.on('userStatusUpdate', (data: any) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: data.online }));
    });

    socketIo.on('statusResponse', (data: any) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: data.online }));
    });

    setSocket(socketIo);
    socketRef.current = socketIo;

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', { conversationId, content });
    }
  }, []);

  const typing = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', conversationId);
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stopTyping', conversationId);
    }
  }, []);

  const checkUserStatus = useCallback((userId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('checkStatus', userId);
    }
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinConversation', conversationId);
    }
  }, []);

  return { socket, socketRef, isConnected, messages, moderationMessages, sendMessage, joinConversation, typing, stopTyping, typingUsers, onlineUsers, checkUserStatus };
};
