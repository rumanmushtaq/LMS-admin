import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Loader2, Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { insertAtCaret, shouldSendOnKeyDown } from '../../lib/chat/composer';

interface ChatMainAreaProps {
  activeChatId: string | null;
  activeChatUser: any;
  isChatLoading: boolean;
  localMessages: any[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  user: any;
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  typing: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  handleSendMessage: () => void;
  typingUsers: Set<string>;
  onlineUsers: Record<string, boolean>;
}

export const ChatMainArea: React.FC<ChatMainAreaProps> = ({
  activeChatId,
  activeChatUser,
  isChatLoading,
  localMessages,
  messagesEndRef,
  user,
  inputMessage,
  setInputMessage,
  typing,
  stopTyping,
  handleSendMessage,
  typingUsers,
  onlineUsers,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (!activeChatId) return;

    typing(activeChatId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(activeChatId);
    }, 2000);
  };

  /**
   * Insert at the caret, close the picker, and return focus to the input.
   *
   * Without the focus return, Enter pressed straight after picking an emoji
   * lands on the picker rather than the message box and nothing is sent.
   */
  const onEmojiClick = (emojiObject: any) => {
    const input = inputRef.current;
    const { value, caret } = insertAtCaret(
      inputMessage,
      emojiObject.emoji,
      input?.selectionStart ?? null,
      input?.selectionEnd ?? null,
    );

    handleInputChange(value);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(caret, caret);
    });
  };

  if (!activeChatId) {
    return (
      <div className="w-2/3 flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <MessageCircle size={48} className="mb-4 opacity-50" />
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const getChatName = () => {
    if (activeChatUser?.firstName || activeChatUser?.lastName) {
      return `${activeChatUser.firstName || ''} ${activeChatUser.lastName || ''}`.trim();
    }
    return activeChatUser?.fullName || activeChatUser?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = activeChatUser?.firstName || activeChatUser?.fullName || activeChatUser?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  const isTyping = activeChatUser?._id && typingUsers.has(activeChatUser._id);
  const isOnline = activeChatUser?._id && onlineUsers[activeChatUser._id];

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const DoubleTick = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 11" width="18" height="11" fill="none">
      <path d="M1 5.5L5.5 10L13.5 1" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 5.5L10.5 10L18.5 1" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const getRenderedMessages = () => {
    const result: React.ReactNode[] = [];
    let lastDateLabel = '';
    const userId = user?._id || user?.id;

    localMessages.forEach((msg, i) => {
      const dateLabel = msg.createdAt ? getDateLabel(msg.createdAt) : '';
      if (dateLabel && dateLabel !== lastDateLabel) {
        lastDateLabel = dateLabel;
        result.push(
          <div key={`date-${i}`} className="flex justify-center my-3 z-10">
            <span className="bg-white/80 backdrop-blur-sm text-[#54656f] text-[12px] font-medium px-4 py-1 rounded-full shadow-sm">
              {dateLabel}
            </span>
          </div>
        );
      }

      const isOwn = msg.senderId === userId;
      const time = msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

      result.push(
        <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} z-10 mb-1`}>
          <div
            className={`
              flex flex-col max-w-[65%] min-w-[100px] px-3 pt-2 pb-1.5
              shadow-[0_1px_1px_rgba(11,20,26,0.13)]
              ${
                isOwn
                  ? 'bg-[#d9fdd3] text-[#111b21] rounded-[8px] rounded-tr-[2px]'
                  : 'bg-white text-[#111b21] rounded-[8px] rounded-tl-[2px]'
              }
            `}
          >
            {/* Message text */}
            <p className="text-[14.5px] leading-[21px] break-words whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>
              {msg.content}
            </p>
            {/* Footer: time + ticks aligned bottom-right */}
            <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
              <span className="text-[11px] text-[#667781] whitespace-nowrap">{time}</span>
              {isOwn && <DoubleTick />}
            </div>
          </div>
        </div>
      );
    });
    return result;
  };

  return (
    <div className="w-2/3 flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-[#f0f2f5] flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
          {getInitials()}
        </div>
        <div>
          <h4 className="font-medium text-[#111b21] text-[16px] leading-tight">
            {getChatName()}
            {activeChatUser?.participants?.length > 2 && ' & Others'}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-[13px] text-[#667781]">
                {isTyping ? <span className="text-green-500 font-medium animate-pulse">typing...</span> : (isOnline ? 'Online' : 'Offline')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages — spacer pushes all messages to the bottom when few exist */}
      <div className="flex-1 px-4 pb-2 pt-4 overflow-y-auto bg-[#efeae2] flex flex-col relative">
        {/* Subtle pattern overlay for WhatsApp feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        {isChatLoading ? (
          <div className="flex justify-center p-8 z-10"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <>
            {/* Spacer that grows to push messages toward the bottom */}
            <div className="flex-1" />
            {getRenderedMessages()}
          </>
        )}
        <div ref={messagesEndRef} className="z-10" />
      </div>

      {/* Input */}
      <div className="p-3 bg-[#f0f2f5] flex items-end gap-2 z-10">
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 text-[#54656f] hover:bg-gray-200 rounded-full transition-colors"
          >
            <Smile size={26} strokeWidth={1.5} />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-100 bg-white">
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                lazyLoadEmojis={true} 
                theme={"light" as any}
                searchDisabled={true}
                skinTonesDisabled={true}
                height={350}
                width={300}
              />
            </div>
          )}
        </div>

        <div className="flex-1 bg-white rounded-lg flex items-center min-h-[42px] px-4 shadow-sm py-1">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (!shouldSendOnKeyDown(e)) return;
              e.preventDefault();
              handleSendMessage();
            }}
            placeholder="Type a message"
            className="w-full bg-transparent focus:outline-none text-[15px] text-[#111b21] placeholder-[#667781]"
          />
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="w-10 h-10 flex items-center justify-center bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] disabled:opacity-0 disabled:w-0 transition-all duration-200 overflow-hidden shrink-0"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};
