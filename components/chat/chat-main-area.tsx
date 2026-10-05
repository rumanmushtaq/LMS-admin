import React, { useState, useRef, useEffect } from 'react';
import {
  Loader2,
  Send,
  Smile,
  CheckCheck,
  Clock3,
  Eye,
  MessageSquareText,
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTheme } from '@nextui-org/react';
import { insertAtCaret, shouldSendOnKeyDown } from '../../lib/chat/composer';
import {
  idOf,
  isSameId,
  nameOf,
  dateLabel,
  formatTime,
  conversationTitle,
  resolveSender,
  runBoundaries,
} from '../../lib/chat/presentation';
import { PeopleAvatar, RoleChips, UserAvatar } from './avatar';

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

/** Neutral canvas with a faint dot grid — texture without an image request. */
const canvasStyle: React.CSSProperties = {
  background: 'var(--nextui-colors-accents0)',
  backgroundImage:
    'radial-gradient(var(--nextui-colors-accents2) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ownBubbleStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #7B57F0 0%, #6A44E6 100%)',
};

const EmptyState = () => (
  <div
    className="flex-1 min-w-0 flex flex-col items-center justify-center text-center p-8"
    style={canvasStyle}
  >
    <div className="relative w-20 h-20 mb-5" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[rgba(112,71,235,0.14)]" />
      <div className="absolute inset-3 rounded-full bg-[var(--nextui-colors-backgroundContrast)] border border-[var(--nextui-colors-border)] flex items-center justify-center text-[var(--nextui-colors-primary)] shadow-[0_6px_16px_-8px_rgba(112,71,235,0.5)]">
        <MessageSquareText size={26} />
      </div>
    </div>
    <h4 className="text-[16px] font-semibold text-[var(--nextui-colors-text)] m-0">
      Pick a conversation
    </h4>
    <p className="text-[13px] leading-5 text-[var(--nextui-colors-accents7)] m-0 mt-1 max-w-[300px]">
      Select a thread on the left to read it, reply as support, or review
      what has been flagged.
    </p>
  </div>
);

const DateChip = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-4" role="separator" aria-label={label}>
    <span className="flex-1 h-px bg-[var(--nextui-colors-border)]" />
    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--nextui-colors-accents7)] bg-[var(--nextui-colors-backgroundContrast)] border border-[var(--nextui-colors-border)] rounded-full px-3 py-1">
      {label}
    </span>
    <span className="flex-1 h-px bg-[var(--nextui-colors-border)]" />
  </div>
);

const TypingBubble = ({ person }: { person: any }) => (
  <div className="flex justify-start items-end mt-3 chat-bubble-in" aria-live="polite">
    <div className="w-7 mr-2 shrink-0">
      <UserAvatar user={person} size={28} />
    </div>
    <div
      className="px-3.5 py-3 rounded-[18px] rounded-bl-[6px] bg-[var(--nextui-colors-backgroundContrast)] border border-[var(--nextui-colors-border)] flex items-center gap-1"
      aria-label={`${nameOf(person)} is typing`}
    >
      <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-[var(--nextui-colors-accents6)]" />
      <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-[var(--nextui-colors-accents6)]" />
      <span className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-[var(--nextui-colors-accents6)]" />
    </div>
  </div>
);

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
  const { isDark } = useTheme();
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
    return <EmptyState />;
  }

  const userId = idOf(user?._id ?? user?.id);
  const participants: any[] = activeChatUser?.participants ?? [];
  const others = participants.filter((p) => !isSameId(p?._id, userId));
  const people = others.length ? others : participants.slice(0, 1);
  const title = conversationTitle(people);

  // Presence is reported for the primary counterpart only.
  const primary = activeChatUser?._id ? activeChatUser : people[0];
  const isOnline = !!(primary?._id && onlineUsers[idOf(primary._id)]);
  const typingPerson = participants.find((p) => typingUsers.has(idOf(p?._id)));

  const renderMessages = () => {
    const result: React.ReactNode[] = [];
    let lastDateLabel = '';

    localMessages.forEach((msg, i) => {
      const label = msg.createdAt ? dateLabel(msg.createdAt) : '';
      if (label && label !== lastDateLabel) {
        lastDateLabel = label;
        result.push(<DateChip key={`date-${i}`} label={label} />);
      }

      const isOwn = isSameId(msg.senderId, userId);
      const time = msg.createdAt ? formatTime(msg.createdAt) : '';

      // A run of messages from one sender reads as one burst: the first
      // bubble carries the name, the last carries the avatar and the tail,
      // and the gap inside the run tightens.
      const { startsRun, endsRun } = runBoundaries(localMessages, i);
      const sender = isOwn ? user : resolveSender(msg, participants);

      result.push(
        <div
          key={msg._id}
          className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'} ${
            startsRun ? 'mt-3' : 'mt-[3px]'
          } chat-bubble-in`}
        >
          {!isOwn && (
            <div className="w-7 mr-2 shrink-0" aria-hidden="true">
              {endsRun && <UserAvatar user={sender} size={28} />}
            </div>
          )}

          <div className={`flex flex-col max-w-[68%] min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
            {!isOwn && startsRun && (
              <span className="flex items-center gap-1.5 mb-1 ml-1 text-[11.5px] font-semibold text-[var(--nextui-colors-accents7)]">
                {nameOf(sender)}
                {sender?.role && <RoleChips people={[sender]} />}
              </span>
            )}

            <div
              className={`relative px-3 py-[7px] text-[14.5px] leading-5 ${
                isOwn
                  ? `text-white rounded-[18px] shadow-[0_4px_12px_-4px_rgba(112,71,235,0.55)] ${
                      endsRun ? 'rounded-br-[6px]' : ''
                    } ${msg.pending ? 'opacity-75' : ''}`
                  : `text-[var(--nextui-colors-text)] bg-[var(--nextui-colors-backgroundContrast)] border border-[var(--nextui-colors-border)] rounded-[18px] shadow-[0_1px_2px_rgba(17,24,28,0.05)] ${
                      endsRun ? 'rounded-bl-[6px]' : ''
                    }`
              }`}
              style={isOwn ? ownBubbleStyle : undefined}
            >
              {/*
                The time sits in the bottom-right corner of the bubble and the
                text reserves room for it with a trailing inline spacer — so a
                one-word message stays one line tall with the time beside it,
                and a long one wraps with the time settling after the last
                line. (A floated time before the paragraph does not work: the
                float's width is not added to the bubble's intrinsic width, so
                the bubble shrinks and the text wraps under the time.)
              */}
              <p
                className="m-0 whitespace-pre-wrap"
                // `anywhere` rather than break-word so a pasted URL cannot push
                // the bubble past its max width.
                style={{ overflowWrap: 'anywhere' }}
              >
                {msg.content}
                <span
                  className="inline-block h-0 align-baseline"
                  style={{ width: isOwn ? 74 : 54 }}
                  aria-hidden="true"
                />
              </p>
              <span
                className={`absolute right-3 bottom-[7px] flex items-center gap-1 text-[10.5px] leading-none whitespace-nowrap ${
                  isOwn ? 'text-white/75' : 'text-[var(--nextui-colors-accents6)]'
                }`}
                aria-hidden="true"
              >
                {time}
                {isOwn &&
                  (msg.pending ? <Clock3 size={12} /> : <CheckCheck size={14} />)}
              </span>

              {/* The visible time is aria-hidden above; this keeps it announced
                  once, in a sensible place, for screen readers. */}
              <span className="sr-only">
                {isOwn ? 'You' : nameOf(sender)}, {time}
                {msg.pending ? ', sending' : ''}
              </span>
            </div>
          </div>
        </div>
      );
    });

    return result;
  };

  return (
    <section className="flex-1 min-w-0 flex flex-col bg-[var(--nextui-colors-backgroundContrast)]">
      {/* Header */}
      <header className="px-5 py-3 border-b border-[var(--nextui-colors-border)] flex items-center gap-3">
        <PeopleAvatar
          people={people}
          size={40}
          online={people.length === 1 ? isOnline : undefined}
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-semibold truncate text-[var(--nextui-colors-text)] m-0 leading-tight">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[var(--nextui-colors-accents7)] min-w-0">
            {typingPerson ? (
              <span className="text-[var(--nextui-colors-primary)] font-medium">
                {people.length > 1 ? `${nameOf(typingPerson)} is typing…` : 'typing…'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-[#0CA30C]' : 'bg-[var(--nextui-colors-accents4)]'
                  }`}
                  aria-hidden="true"
                />
                {isOnline ? 'Online' : 'Offline'}
              </span>
            )}
            <span className="text-[var(--nextui-colors-accents4)]" aria-hidden="true">·</span>
            <RoleChips people={people} />
          </div>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md bg-[var(--nextui-colors-accents0)] text-[var(--nextui-colors-accents7)] shrink-0">
          <Eye size={12} /> Moderator view
        </span>
      </header>

      {/* Messages — spacer pushes all messages to the bottom when few exist */}
      <div
        className="flex-1 min-h-0 overflow-y-auto chat-scroll px-5 pt-3 pb-3 flex flex-col"
        style={canvasStyle}
      >
        {isChatLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--nextui-colors-accents5)]" />
          </div>
        ) : (
          <>
            <div className="flex-1" />
            {renderMessages()}
            {typingPerson && <TypingBubble person={typingPerson} />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-[var(--nextui-colors-border)]">
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-1 min-h-[44px] rounded-full border border-[var(--nextui-colors-border)] bg-[var(--nextui-colors-accents0)] pl-1.5 pr-3 focus-within:border-[var(--nextui-colors-primary)] focus-within:bg-[var(--nextui-colors-backgroundContrast)] transition-colors">
            <div className="relative shrink-0" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Add emoji"
                aria-expanded={showEmojiPicker}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  showEmojiPicker
                    ? 'text-[var(--nextui-colors-primary)] bg-[rgba(112,71,235,0.14)]'
                    : 'text-[var(--nextui-colors-accents6)] hover:text-[var(--nextui-colors-text)] hover:bg-[var(--nextui-colors-accents1)]'
                }`}
              >
                <Smile size={20} strokeWidth={1.75} />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50 rounded-xl overflow-hidden border border-[var(--nextui-colors-border)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.3)]">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis={true}
                    theme={(isDark ? 'dark' : 'light') as any}
                    searchDisabled={true}
                    skinTonesDisabled={true}
                    height={350}
                    width={300}
                  />
                </div>
              )}
            </div>

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
              placeholder="Write a message…"
              aria-label="Message"
              className="flex-1 min-w-0 bg-transparent outline-none py-2 text-[14.5px] text-[var(--nextui-colors-text)] placeholder:text-[var(--nextui-colors-accents6)]"
            />
          </div>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all bg-[var(--nextui-colors-primary)] text-white shadow-[0_8px_18px_-8px_rgba(112,71,235,0.7)] hover:brightness-110 active:scale-95 disabled:bg-[var(--nextui-colors-accents2)] disabled:text-[var(--nextui-colors-accents5)] disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <Send size={18} className="ml-0.5 -mt-px" />
          </button>
        </div>
      </div>
    </section>
  );
};
