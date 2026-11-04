import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import chatService from '../services/chat';
import { useChatSocket } from './useChatSocket';
import { mergeMessages } from '../lib/chat/messages';
import { useAdminNotifications } from '../store/adminNotifications';

const CONVERSATIONS_KEY = ['admin-conversations'] as const;
const FLAGGED_KEY = ['admin-flagged-messages'] as const;
const messagesKey = (conversationId: string | null) =>
  ['admin-chat-messages', conversationId] as const;

// Stable fallback so effects keyed on these lists don't rerun every render.
const EMPTY: any[] = [];

export const useAdminChat = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuthStore();
  const { isConnected, messages: socketMessages, moderationMessages, sendMessage, joinConversation, typing, stopTyping, typingUsers, onlineUsers, checkUserStatus } = useChatSocket(accessToken || '');
  // Clears the app-wide unread badge (sidebar tab) for a thread once opened.
  const markConversationRead = useAdminNotifications((s) => s.markConversationRead);

  const [activeTab, setActiveTab] = useState<'chats' | 'flagged'>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  // Only the visible tab's list is fetched, as before. Socket events patch
  // these caches in place, so a focus refetch must not overwrite them.
  const conversationsQuery = useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: async (): Promise<any[]> => {
      const res = await chatService.getAllConversations();
      return res?.data ?? res ?? [];
    },
    enabled: !!accessToken && activeTab === 'chats',
    refetchOnWindowFocus: false,
    // Live data: never trust the global staleTime, and don't refetch on
    // reconnect — that would drop socket-merged messages from the cache.
    staleTime: 0,
    refetchOnReconnect: false,
    retry: false,
  });

  const flaggedQuery = useQuery({
    queryKey: FLAGGED_KEY,
    queryFn: async (): Promise<any[]> => {
      const res = await chatService.getFlaggedMessages();
      return res?.data ?? res ?? [];
    },
    enabled: !!accessToken && activeTab === 'flagged',
    refetchOnWindowFocus: false,
    // Live data: never trust the global staleTime, and don't refetch on
    // reconnect — that would drop socket-merged messages from the cache.
    staleTime: 0,
    refetchOnReconnect: false,
    retry: false,
  });

  const conversations = conversationsQuery.data ?? EMPTY;
  const flaggedMessages = flaggedQuery.data ?? EMPTY;
  const isLoading =
    activeTab === 'chats' ? conversationsQuery.isFetching : flaggedQuery.isFetching;

  // Message history for the open thread. Socket messages and optimistic sends
  // are folded into this cache entry; a refetch would drop unechoed ones.
  const messagesQuery = useQuery({
    queryKey: messagesKey(activeChatId),
    queryFn: async (): Promise<any[]> => {
      const res = await chatService.getMessages(activeChatId as string);
      return res?.data ?? res ?? [];
    },
    enabled: !!activeChatId,
    refetchOnWindowFocus: false,
    // Live data: never trust the global staleTime, and don't refetch on
    // reconnect — that would drop socket-merged messages from the cache.
    staleTime: 0,
    refetchOnReconnect: false,
    retry: false,
  });

  const localMessages = messagesQuery.data ?? EMPTY;
  const isChatLoading = messagesQuery.isFetching;

  useEffect(() => {
    if (conversationsQuery.error) console.error(conversationsQuery.error);
  }, [conversationsQuery.error]);
  useEffect(() => {
    if (flaggedQuery.error) console.error(flaggedQuery.error);
  }, [flaggedQuery.error]);
  useEffect(() => {
    if (messagesQuery.error) console.error(messagesQuery.error);
  }, [messagesQuery.error]);

  /** Edits the cached conversation list in place — no refetch, no spinner. */
  const updateConversations = useCallback(
    (fn: (prev: any[]) => any[]) =>
      queryClient.setQueryData<any[]>(CONVERSATIONS_KEY, (old) => (old ? fn(old) : old)),
    [queryClient],
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages update.
  // `block: 'nearest'` keeps this inside the message list — the default scrolls
  // the whole admin page, yanking the layout on every incoming message.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [localMessages]);

  // Fold in socket messages.
  //
  // React batches state updates, so several events can land between two
  // renders. Reading only socketMessages[length - 1] dropped every message but
  // the newest — they then reappeared when the thread was reopened, because
  // that refetches history over HTTP.
  const lastMergedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (socketMessages.length === 0) return;

    const seenIndex = lastMergedIdRef.current
      ? socketMessages.findIndex((m) => m._id === lastMergedIdRef.current)
      : -1;
    const fresh = socketMessages.slice(seenIndex + 1);
    if (fresh.length === 0) return;

    lastMergedIdRef.current = socketMessages[socketMessages.length - 1]._id;

    // No thread open means nothing on screen to merge into; opening one
    // fetches its history fresh.
    if (!activeChatId) return;

    const userId = (user as any)?._id || (user as any)?.id || null;
    queryClient.setQueryData<any[]>(messagesKey(activeChatId), (prev) =>
      mergeMessages(prev ?? [], fresh, { conversationId: activeChatId, currentUserId: userId })
    );
  }, [socketMessages, activeChatId, user, queryClient]);

  // Moderation broadcast: bump the conversation list (last message, unread
  // badge, recency order) for every message in the system — including threads
  // the admin has not opened and is not a participant in. This is what makes a
  // new message actually show up in the admin's conversation list.
  const lastModIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (moderationMessages.length === 0) return;

    const seenIndex = lastModIdRef.current
      ? moderationMessages.findIndex((m) => m.message?._id === lastModIdRef.current)
      : -1;
    const fresh = moderationMessages.slice(seenIndex + 1);
    if (fresh.length === 0) return;
    lastModIdRef.current =
      moderationMessages[moderationMessages.length - 1].message?._id ?? lastModIdRef.current;

    const userId = (user as any)?._id || (user as any)?.id || null;

    // Read before patching: the known ids are the same either way.
    const knownIds = new Set(
      (queryClient.getQueryData<any[]>(CONVERSATIONS_KEY) ?? []).map((c) => c._id),
    );

    updateConversations((prev) => {
      let changed = false;
      const next = prev.map((c) => {
        const forConv = fresh.filter((m) => m.conversationId === c._id);
        if (forConv.length === 0) return c;
        changed = true;
        const latest = forConv[forConv.length - 1].message;
        const isOpen = c._id === activeChatId;
        const incoming = forConv.filter((m) => m.senderId !== userId).length;
        return {
          ...c,
          lastMessage: { content: latest?.content, createdAt: latest?.createdAt },
          updatedAt: latest?.createdAt ?? c.updatedAt,
          unreadCount: isOpen ? 0 : (c.unreadCount ?? 0) + incoming,
        };
      });
      if (!changed) return prev;
      // Most-recently-active first, so the bumped thread rises to the top.
      next.sort((a, b) => {
        const ad = new Date(a.lastMessage?.createdAt ?? a.updatedAt ?? 0).getTime();
        const bd = new Date(b.lastMessage?.createdAt ?? b.updatedAt ?? 0).getTime();
        return bd - ad;
      });
      return next;
    });

    // A message for a conversation not yet in the list means a brand-new
    // thread — reload so it appears (and this admin can moderate it).
    if (fresh.some((m) => m.conversationId && !knownIds.has(m.conversationId))) {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderationMessages, activeChatId, user]);

  // Defined with useCallback so it can be safely used in useEffect below
  const openConversation = useCallback(async (conv: any) => {
    setActiveChatId(conv._id);
    // Opening a thread clears its app-wide unread badge (bell/sidebar counters).
    markConversationRead(conv._id);
    // Also zero the local list count so the "All Chats" tab total stays accurate.
    updateConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c)),
    );
    const userId = user?._id || user?.id;
    const otherParticipants = conv.participants?.filter((p: any) => p._id !== userId) || [];
    const otherUser = otherParticipants.length > 0 ? otherParticipants[0] : conv.participants?.[0];

    setActiveChatUser({ ...otherUser, participants: conv.participants });

    if (otherUser?._id) {
      checkUserStatus(otherUser._id);
    }

    // Use joinConversation from the hook which uses socketRef (always the fresh socket)
    joinConversation(conv._id);

    // Always reload history on open, as before: refetches now if this thread
    // is already showing, otherwise marks the cached copy stale so the query
    // fetches it when activeChatId switches over.
    queryClient.invalidateQueries({ queryKey: messagesKey(conv._id) });
  }, [user, joinConversation, checkUserStatus, markConversationRead, updateConversations, queryClient]);

  // Auto-open a conversation when navigated from teacher/student detail page
  const hasProcessedOpenParam = useRef(false);

  useEffect(() => {
    const openId = router.query.openConversation as string;
    if (!openId || conversations.length === 0) return;
    if (hasProcessedOpenParam.current) return;
    
    const targetConv = conversations.find((c) => c._id === openId);
    if (targetConv) {
      hasProcessedOpenParam.current = true;
      openConversation(targetConv);
      // Clear the query param so back navigation is clean
      router.replace('/chat', undefined, { shallow: true });
    }
  }, [router.query.openConversation, conversations, openConversation, router]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatId || !user) return;
    const content = inputMessage.trim();
    const userId = (user as any)?._id || (user as any)?.id || '';

    // Optimistic update — show message immediately without waiting for socket echo.
    // `pending` is what lets the echo replace this placeholder instead of
    // appending a second copy of the same message.
    const optimisticMsg = {
      _id: `temp_${Date.now()}`,
      conversationId: activeChatId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    queryClient.setQueryData<any[]>(messagesKey(activeChatId), (prev) => [
      ...(prev ?? []),
      optimisticMsg,
    ]);

    sendMessage(activeChatId, content);
    stopTyping(activeChatId);
    setInputMessage('');
  };

  const resolveFlagMutation = useMutation({
    mutationFn: (msgId: string) => chatService.resolveFlaggedMessage(msgId),
    onSuccess: (_res, msgId) => {
      queryClient.setQueryData<any[]>(FLAGGED_KEY, (prev) =>
        prev ? prev.filter((m) => m._id !== msgId) : prev,
      );
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const resolveFlag = async (msgId: string) => {
    try {
      await resolveFlagMutation.mutateAsync(msgId);
    } catch {
      // Already logged in onError.
    }
  };

  const blockMutation = useMutation({
    mutationFn: (convId: string) => chatService.blockConversation(convId),
    onSuccess: () => {
      alert('Conversation blocked successfully.');
    },
    onError: (err) => {
      console.error(err);
      alert('Failed to block the conversation.');
    },
  });

  const blockConversationAction = async (
    conversation: string | { _id: string } | null | undefined,
  ) => {
    // The flagged-messages query populates `conversationId`, so this arrives as
    // the whole conversation document. Passing it straight into the URL built
    // `/conversations/[object Object]/block`, which never blocked anything.
    const convId =
      typeof conversation === 'string' ? conversation : conversation?._id;

    if (!convId) {
      console.error('blockConversation: could not resolve a conversation id', conversation);
      return;
    }

    try {
      await blockMutation.mutateAsync(convId);
    } catch {
      // Already reported in onError.
    }
  };

  return {
    user,
    isConnected,
    activeTab,
    setActiveTab,
    conversations,
    flaggedMessages,
    isLoading,
    activeChatId,
    setActiveChatId,
    activeChatUser,
    localMessages,
    inputMessage,
    setInputMessage,
    isChatLoading,
    messagesEndRef,
    openConversation,
    handleSendMessage,
    resolveFlag,
    blockConversationAction,
    typing,
    stopTyping,
    typingUsers,
    onlineUsers,
  };
};
