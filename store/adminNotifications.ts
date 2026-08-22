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
  /** Bell unread count (cleared when the bell is opened). */
  unreadCount: number;
  /** Unread messages per conversation — drives the sidebar tab + each row. */
  unreadByConversation: Record<string, number>;
  add: (n: AdminNotification) => void;
  markAllRead: () => void;
  markConversationRead: (conversationId: string) => void;
  clear: () => void;
}

/**
 * App-wide notification feed for the admin bell AND per-conversation unread
 * counts for the chat tab/list. Populated by a single global socket (see
 * useAdminNotificationsSocket), so it works on every page — not only /chat.
 */
export const useAdminNotifications = create<AdminNotificationsState>((set) => ({
  items: [],
  unreadCount: 0,
  unreadByConversation: {},
  add: (n) =>
    set((s) => {
      if (n.id && s.items.some((i) => i.id === n.id)) return s; // dedupe
      const unreadByConversation = { ...s.unreadByConversation };
      if (n.conversationId) {
        unreadByConversation[n.conversationId] =
          (unreadByConversation[n.conversationId] ?? 0) + 1;
      }
      return {
        items: [n, ...s.items].slice(0, 50),
        unreadCount: s.unreadCount + 1,
        unreadByConversation,
      };
    }),
  markAllRead: () => set({ unreadCount: 0 }),
  markConversationRead: (conversationId) =>
    set((s) => {
      if (!s.unreadByConversation[conversationId]) return s;
      const unreadByConversation = { ...s.unreadByConversation };
      delete unreadByConversation[conversationId];
      return { unreadByConversation };
    }),
  clear: () => set({ items: [], unreadCount: 0, unreadByConversation: {} }),
}));
