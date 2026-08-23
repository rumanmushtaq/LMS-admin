import React, { useMemo, useState } from 'react';
import {
  MessageCircle,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Ban,
  Search,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { PeopleAvatar, RoleChips, UserAvatar } from './avatar';
import {
  conversationPeople,
  conversationTitle,
  filterConversations,
  formatListDate,
  nameOf,
} from '../../lib/chat/presentation';

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
  // Flagged messages arrive with `conversationId` populated, so this may be
  // either an id or the whole conversation document.
  blockConversationAction: (conversation: string | { _id: string } | null | undefined) => void;
}

const TabButton = ({
  active,
  onClick,
  icon,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  tone: 'purple' | 'red';
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex-1 h-9 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
      active
        ? 'bg-[var(--nextui-colors-backgroundContrast)] text-[var(--nextui-colors-text)] shadow-[0_1px_2px_rgba(17,24,28,0.10)]'
        : 'text-[var(--nextui-colors-accents7)] hover:text-[var(--nextui-colors-text)]'
    }`}
  >
    {icon}
    {label}
    {count > 0 && (
      <span
        className={`min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
          tone === 'red' ? 'bg-[#D03B3B]' : 'bg-[var(--nextui-colors-primary)]'
        }`}
      >
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);

const EmptyList = ({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-14">
    <div className="w-12 h-12 rounded-full bg-[var(--nextui-colors-accents0)] text-[var(--nextui-colors-accents6)] flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-[14px] font-semibold text-[var(--nextui-colors-text)] m-0">{title}</p>
    <p className="text-[12.5px] text-[var(--nextui-colors-accents7)] m-0 mt-1">{hint}</p>
  </div>
);

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
  const [query, setQuery] = useState('');
  const userId = user?._id || user?.id;

  // Total unread across all conversations, for the "Chats" tab badge.
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );

  const visibleConversations = useMemo(
    () => filterConversations(conversations, query, userId),
    [conversations, query, userId],
  );

  return (
    <aside className="w-[340px] shrink-0 flex flex-col border-r border-[var(--nextui-colors-border)] bg-[var(--nextui-colors-backgroundContrast)]">
      {/* Segmented control */}
      <div className="px-3 pt-3">
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--nextui-colors-accents0)]">
          <TabButton
            active={activeTab === 'chats'}
            onClick={() => { setActiveTab('chats'); setActiveChatId(null); }}
            icon={<MessageCircle size={15} />}
            label="Chats"
            count={totalUnread}
            tone="purple"
          />
          <TabButton
            active={activeTab === 'flagged'}
            onClick={() => { setActiveTab('flagged'); setActiveChatId(null); }}
            icon={<AlertTriangle size={15} />}
            label="Flagged"
            count={flaggedMessages.length}
            tone="red"
          />
        </div>
      </div>

      {/* Search (chats only) */}
      {activeTab === 'chats' && (
        <div className="px-3 pt-3 pb-1">
          <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[var(--nextui-colors-accents0)] border border-transparent focus-within:border-[var(--nextui-colors-primary)] focus-within:bg-[var(--nextui-colors-backgroundContrast)] transition-colors">
            <Search size={15} className="text-[var(--nextui-colors-accents6)] shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="w-full bg-transparent outline-none text-[13px] text-[var(--nextui-colors-text)] placeholder:text-[var(--nextui-colors-accents6)]"
            />
          </label>
        </div>
      )}

      <div className="flex-1 overflow-y-auto chat-scroll py-2">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-[var(--nextui-colors-accents5)]" />
          </div>
        ) : activeTab === 'chats' ? (
          visibleConversations.length === 0 ? (
            <EmptyList
              icon={<Inbox size={20} />}
              title={query ? 'No matches' : 'No conversations yet'}
              hint={
                query
                  ? 'Try a different name or phrase.'
                  : 'Threads between tutors and students will appear here.'
              }
            />
          ) : (
            visibleConversations.map((conv) => {
              const people = conversationPeople(conv, userId);
              const title = conversationTitle(people);
              const unread = conv.unreadCount || 0;
              const isActive = activeChatId === conv._id;
              const hasUnread = unread > 0 && !isActive;
              const preview = conv.lastMessage?.content;
              const when = formatListDate(conv.lastMessage?.createdAt ?? conv.updatedAt);

              return (
                <button
                  key={conv._id}
                  type="button"
                  onClick={() => openConversation(conv)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[rgba(112,71,235,0.14)]'
                      : 'hover:bg-[var(--nextui-colors-accents0)]'
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[var(--nextui-colors-primary)]"
                      aria-hidden="true"
                    />
                  )}
                  <PeopleAvatar people={people} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`text-[14px] truncate m-0 text-[var(--nextui-colors-text)] ${
                          hasUnread ? 'font-bold' : 'font-semibold'
                        }`}
                      >
                        {title}
                      </p>
                      {when && (
                        <span
                          className={`text-[11px] shrink-0 ${
                            hasUnread
                              ? 'text-[var(--nextui-colors-primary)] font-semibold'
                              : 'text-[var(--nextui-colors-accents6)]'
                          }`}
                        >
                          {when}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5 min-h-[18px]">
                      {preview ? (
                        <p
                          className={`text-[13px] truncate m-0 ${
                            hasUnread
                              ? 'text-[var(--nextui-colors-text)] font-medium'
                              : 'text-[var(--nextui-colors-accents7)]'
                          }`}
                        >
                          {preview}
                        </p>
                      ) : (
                        <RoleChips people={people} />
                      )}
                      {hasUnread && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--nextui-colors-primary)] text-white text-[11px] font-bold flex items-center justify-center">
                          {unread > 99 ? '99+' : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )
        ) : flaggedMessages.length === 0 ? (
          <EmptyList
            icon={<ShieldCheck size={20} />}
            title="Nothing flagged"
            hint="Reported messages will show up here for review."
          />
        ) : (
          <div className="flex flex-col gap-3 px-3 pt-1 pb-3">
            {flaggedMessages.map((msg) => (
              <article
                key={msg._id}
                className="rounded-xl border border-[var(--nextui-colors-border)] bg-[var(--nextui-colors-backgroundContrast)] overflow-hidden"
              >
                <div className="h-[3px] bg-[#D03B3B]" aria-hidden="true" />
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#D03B3B]">
                      <AlertTriangle size={12} /> Reported
                    </span>
                    {msg.createdAt && (
                      <span className="text-[11px] text-[var(--nextui-colors-accents6)]">
                        {formatListDate(msg.createdAt)}
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-2 mb-0 text-[13.5px] leading-5 text-[var(--nextui-colors-text)] rounded-lg bg-[var(--nextui-colors-accents0)] px-3 py-2 whitespace-pre-wrap"
                    style={{ overflowWrap: 'anywhere' }}
                  >
                    &ldquo;{msg.content}&rdquo;
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserAvatar user={msg.senderId} size={24} />
                      <span className="text-[12px] text-[var(--nextui-colors-accents7)] truncate">
                        {nameOf(msg.senderId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => resolveFlag(msg._id)}
                        className="h-7 px-2.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 bg-[rgba(12,163,12,0.12)] text-[#0A7A0A] hover:bg-[rgba(12,163,12,0.2)] transition-colors"
                      >
                        <CheckCircle size={13} /> Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => blockConversationAction(msg.conversationId)}
                        className="h-7 px-2.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 text-[#D03B3B] hover:bg-[rgba(208,59,59,0.1)] transition-colors"
                      >
                        <Ban size={13} /> Block
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
