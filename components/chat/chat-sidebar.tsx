import React from 'react';
import { MessageCircle, AlertTriangle, Loader2, CheckCircle, Ban } from 'lucide-react';

interface ChatSidebarProps {
  activeTab: 'chats' | 'flagged';
  setActiveTab: (tab: 'chats' | 'flagged') => void;
  setActiveChatId: (id: string | null) => void;
  activeChatId: string | null;
  isLoading: boolean;
  conversations: any[];
  flaggedMessages: any[];
  user: any;
  openConversation: (conv: any) => void;
  resolveFlag: (msgId: string) => void;
  blockConversationAction: (convId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeTab,
  setActiveTab,
  setActiveChatId,
  activeChatId,
  isLoading,
  conversations,
  flaggedMessages,
  user,
  openConversation,
  resolveFlag,
  blockConversationAction,
}) => {



  return (
    <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('chats'); setActiveChatId(null); }}
          className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'chats' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <MessageCircle size={16} /> All Chats
        </button>
        <button
          onClick={() => { setActiveTab('flagged'); setActiveChatId(null); }}
          className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'flagged' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <AlertTriangle size={16} /> Flagged
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : activeTab === 'chats' ? (
          conversations.length === 0 ? (
            <p className="text-center text-gray-500 p-8 text-sm">No conversations found.</p>
          ) : (
            conversations.map(conv => {
              const userId = user?._id || user?.id;
              const otherParticipants = conv.participants?.filter((p: any) => p._id !== userId) || [];
              const displayUser = otherParticipants.length > 0 ? otherParticipants[0] : conv.participants?.[0];
              const secondUser = otherParticipants.length > 1 ? otherParticipants[1] : null;
              
              const getName = (u: any) => {
                if (!u) return 'User';
                if (u.firstName || u.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
                if (u.fullName) return u.fullName;
                if (u.email) return u.email.split('@')[0];
                return 'User';
              };

              const displayName = secondUser 
                ? `${getName(displayUser)} & ${getName(secondUser)}`
                : getName(displayUser);
                
              const displayRole = secondUser ? 'Multiple Users' : (displayUser?.role || 'User');
              const initial = displayName.charAt(0).toUpperCase() || 'U';

              return (
                <div
                  key={conv._id}
                  onClick={() => openConversation(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50/30 transition-colors ${activeChatId === conv._id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <p className="font-medium text-sm text-gray-900 truncate">{displayName}</p>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${displayRole.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : displayRole.toLowerCase() === 'tutor' ? 'bg-green-100 text-green-700' : displayRole.toLowerCase() === 'multiple users' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                          {displayRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          flaggedMessages.length === 0 ? (
            <p className="text-center text-gray-500 p-8 text-sm">No flagged messages.</p>
          ) : (
            flaggedMessages.map(msg => (
              <div key={msg._id} className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle size={12} /> Reported
                  </span>
                  <button onClick={() => resolveFlag(msg._id)} className="text-xs text-green-600 font-medium flex items-center gap-1 hover:text-green-700 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle size={12} /> Resolve
                  </button>
                </div>
                <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg mb-2">&quot;{msg.content}&quot;</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">By: {msg.senderId?.firstName || msg.senderId?.fullName || msg.senderId?.email || 'User'}</span>
                  <button onClick={() => blockConversationAction(msg.conversationId)} className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1">
                    <Ban size={12} /> Block Chat
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
