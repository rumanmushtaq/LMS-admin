import React from 'react';
import { Text } from '@nextui-org/react';
import { useAdminChat } from '../hooks/useAdminChat';
import { ChatSidebar } from '../components/chat/chat-sidebar';
import { ChatMainArea } from '../components/chat/chat-main-area';

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
    typingUsers,
    onlineUsers,
  } = useAdminChat();

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Text h3>Admin Support & Moderation</Text>
          <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full shadow-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium text-gray-700">{isConnected ? 'Server Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
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
            handleSendMessage={handleSendMessage}
            typingUsers={typingUsers}
            onlineUsers={onlineUsers}
          />
        </div>
      </div>
  );
};

export default AdminChatPage;
