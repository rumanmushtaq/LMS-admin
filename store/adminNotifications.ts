import { create } from 'zustand';

export interface AdminNotification {
  id: string;
  title: string;
  content: string;
  conversationId?: string;
  createdAt: string;
}

interface AdminNotificationsState {
  items: AdminNotification[];
  unreadCount: number;
  add: (n: AdminNotification) => void;
  markAllRead: () => void;
  clear: () => void;
}

/**
 * App-wide notification feed for the admin bell. Populated by a single global
 * socket (see useAdminNotificationsSocket), so notifications arrive on every
 * page — not only the chat page.
 */
export const useAdminNotifications = create<AdminNotificationsState>((set) => ({
  items: [],
  unreadCount: 0,
  add: (n) =>
    set((s) => {
      if (n.id && s.items.some((i) => i.id === n.id)) return s; // dedupe
      return {
        items: [n, ...s.items].slice(0, 50),
        unreadCount: s.unreadCount + 1,
      };
    }),
  markAllRead: () => set({ unreadCount: 0 }),
  clear: () => set({ items: [], unreadCount: 0 }),
}));
