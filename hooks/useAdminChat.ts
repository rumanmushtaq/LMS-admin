import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import chatService from '../services/chat';
import { useChatSocket } from './useChatSocket';

export const useAdminChat = () => {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const { isConnected, messages: socketMessages, sendMessage, joinConversation, typing, stopTyping, typingUsers, onlineUsers, checkUserStatus } = useChatSocket(accessToken || '');

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

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  useEffect(() => {
    if (socketMessages.length > 0) {
      const latest = socketMessages[socketMessages.length - 1];
      setLocalMessages((prev) => {
        // If the exact message _id already exists, skip
        if (prev.some((m) => m._id === latest._id)) return prev;
        // Replace a matching temp/optimistic message (same content + conversationId) if exists
        const tempIndex = prev.findIndex(
          (m) => m._id?.startsWith('temp_') && m.content === latest.content && m.conversationId === latest.conversationId
        );
        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = latest;
          return updated;
        }
        return [...prev, latest];
      });
    }
  }, [socketMessages]);

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

    // Optimistic update — show message immediately without waiting for socket echo
    const optimisticMsg = {
      _id: `temp_${Date.now()}`,
      conversationId: activeChatId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
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

  const blockConversationAction = async (convId: string) => {
    try {
      await chatService.blockConversation(convId);
      alert('Conversation blocked successfully.');
    } catch (err) {
      console.error(err);
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
