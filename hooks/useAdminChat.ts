import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import chatService from '../services/chat';
import { useChatSocket } from './useChatSocket';
import { mergeMessages } from '../lib/chat/messages';

export const useAdminChat = () => {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const { isConnected, messages: socketMessages, moderationMessages, sendMessage, joinConversation, typing, stopTyping, typingUsers, onlineUsers, checkUserStatus } = useChatSocket(accessToken || '');

  const [activeTab, setActiveTab] = useState<'chats' | 'flagged'>('chats');
  const [conversations, setConversations] = useState<any[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

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

    const userId = (user as any)?._id || (user as any)?.id || null;
    setLocalMessages((prev) =>
      mergeMessages(prev, fresh, { conversationId: activeChatId, currentUserId: userId })
    );
  }, [socketMessages, activeChatId, user]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'chats') {
        const res = await chatService.getAllConversations();
        setConversations(res?.data ?? res ?? []);
      } else {
        const res = await chatService.getFlaggedMessages();
        setFlaggedMessages(res?.data ?? res ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!accessToken) return;
    loadData();
  }, [accessToken, activeTab, loadData]);

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

    setConversations((prev) => {
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
    const knownIds = new Set(conversations.map((c) => c._id));
    if (fresh.some((m) => m.conversationId && !knownIds.has(m.conversationId))) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderationMessages, activeChatId, user]);

  // Defined with useCallback so it can be safely used in useEffect below
  const openConversation = useCallback(async (conv: any) => {
    setActiveChatId(conv._id);
    const userId = user?._id || user?.id;
    const otherParticipants = conv.participants?.filter((p: any) => p._id !== userId) || [];
    const otherUser = otherParticipants.length > 0 ? otherParticipants[0] : conv.participants?.[0];

    setActiveChatUser({ ...otherUser, participants: conv.participants });
    setIsChatLoading(true);

    if (otherUser?._id) {
      checkUserStatus(otherUser._id);
    }

    // Use joinConversation from the hook which uses socketRef (always the fresh socket)
    joinConversation(conv._id);

    try {
      const res = await chatService.getMessages(conv._id);
      setLocalMessages(res?.data ?? res ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  }, [user, joinConversation, checkUserStatus]);

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
    setLocalMessages((prev) => [...prev, optimisticMsg]);

    sendMessage(activeChatId, content);
    stopTyping(activeChatId);
    setInputMessage('');
  };

  const resolveFlag = async (msgId: string) => {
    try {
      await chatService.resolveFlaggedMessage(msgId);
      setFlaggedMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (err) {
      console.error(err);
    }
  };

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
      await chatService.blockConversation(convId);
      alert('Conversation blocked successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to block the conversation.');
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
