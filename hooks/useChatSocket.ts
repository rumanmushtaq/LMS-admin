import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  messages: any[];
  sendMessage: (conversationId: string, content: string) => void;
  typing: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

export const useChatSocket = (token?: string): ChatSocketHook => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Use environment variable for backend URL if available
    const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

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

    socketIo.on('newMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    socketIo.on('userTyping', (data: any) => {
      console.log('User is typing...', data);
    });

    socketIo.on('userStoppedTyping', (data: any) => {
      console.log('User stopped typing...', data);
    });

    setSocket(socketIo);
    socketRef.current = socketIo;

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  const sendMessage = (conversationId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', { conversationId, content });
    }
  };

  const typing = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', conversationId);
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stopTyping', conversationId);
    }
  };

  return { socket, isConnected, messages, sendMessage, typing, stopTyping };
};
