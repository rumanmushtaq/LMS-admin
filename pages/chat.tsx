import React from 'react';
import { Text } from '@nextui-org/react';
import { useAdminChat } from '../hooks/useAdminChat';
import { ChatSidebar } from '../components/chat/chat-sidebar';
import { ChatMainArea } from '../components/chat/chat-main-area';

const ConnectionPill = ({ connected }: { connected: boolean }) => (
  <div
    className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-[var(--nextui-colors-border)] bg-[var(--nextui-colors-backgroundContrast)] text-[12.5px] font-medium text-[var(--nextui-colors-accents8)] shrink-0"
    role="status"
    aria-live="polite"
  >
    <span
      className={`relative w-2 h-2 rounded-full ${
        connected ? 'bg-[#0CA30C] chat-pulse' : 'bg-[#D03B3B]'
      }`}
      aria-hidden="true"
    />
    {connected ? 'Live' : 'Reconnecting…'}
  </div>
);

const AdminChatPage = () => {
  const {
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
  } = useAdminChat();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <Text h3 css={{ m: 0, fontSize: '22px', letterSpacing: '-0.01em' }}>
            Support &amp; Moderation
          </Text>
          <Text css={{ m: 0, mt: '2px', fontSize: '13px', color: '$accents7' }}>
            Watch every conversation on the platform and act on anything flagged.
          </Text>
        </div>
        <ConnectionPill connected={isConnected} />
      </div>

      <div className="flex-1 min-h-0 flex rounded-2xl border border-[var(--nextui-colors-border)] bg-[var(--nextui-colors-backgroundContrast)] shadow-[0_1px_2px_rgba(17,24,28,0.04)] overflow-hidden">
        <ChatSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveChatId={setActiveChatId}
          activeChatId={activeChatId}
          isLoading={isLoading}
          conversations={conversations}
          flaggedMessages={flaggedMessages}
          user={user}
          openConversation={openConversation}
          resolveFlag={resolveFlag}
          blockConversationAction={blockConversationAction}
        />
        <ChatMainArea
          activeChatId={activeChatId}
          activeChatUser={activeChatUser}
          isChatLoading={isChatLoading}
          localMessages={localMessages}
          messagesEndRef={messagesEndRef}
          user={user}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          typing={typing}
          stopTyping={stopTyping}
          handleSendMessage={handleSendMessage}
          typingUsers={typingUsers}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
};

export default AdminChatPage;
