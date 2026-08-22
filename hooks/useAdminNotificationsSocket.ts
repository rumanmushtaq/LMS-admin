import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useAdminNotifications } from '../store/adminNotifications';

/**
 * One app-wide socket that feeds the notification bell, mounted in the layout
 * so it runs on every admin page (the chat page opens its own socket for the
 * open thread). It relies on the backend joining admins to an 'admins' room on
 * connect and broadcasting every message as 'moderationMessage', so a new chat
 * anywhere surfaces in the bell — not only while the chat page is open.
 */
export const useAdminNotificationsSocket = () => {
  const { accessToken, user } = useAuthStore();
  const add = useAdminNotifications((s) => s.add);

  useEffect(() => {
    if (!accessToken) return;

    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const socket = io(url, { auth: { token: accessToken }, transports: ['websocket'] });
    const uid = (user as any)?._id || (user as any)?.id;

    socket.on('moderationMessage', (data: any) => {
      if (!data || data.senderId === uid) return; // ignore the admin's own messages
      add({
        id: data.message?._id || `${data.conversationId}-${Date.now()}`,
        title: data.senderName ? `New message from ${data.senderName}` : 'New message',
        content: data.message?.content || '',
        conversationId: data.conversationId,
        createdAt: data.message?.createdAt || new Date().toISOString(),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, user, add]);
};
