/**
 * Presentation helpers for the admin chat: how people, ids and times are
 * shown. Pure functions only, so the two chat components stay about layout.
 */

/**
 * Mongo ids reach the UI in more than one shape: REST payloads populate
 * `senderId`/`participants` into objects, while socket events send bare ids.
 */
export const idOf = (value: any): string =>
  value && typeof value === 'object'
    ? String(value._id ?? value.id ?? '')
    : String(value ?? '');

/** True when two ids refer to the same user, whatever shape they arrived in. */
export const isSameId = (a: any, b: any): boolean => {
  const left = idOf(a);
  return left !== '' && left === idOf(b);
};

export const nameOf = (user: any): string => {
  if (!user) return 'User';
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  if (user.fullName) return user.fullName;
  if (user.email) return String(user.email).split('@')[0];
  return 'User';
};

/** "Tutor First" → "TF"; a single word keeps one letter. */
export const initialsOf = (name: string): string => {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((p) => p.charAt(0).toUpperCase()).join('');
  return letters || 'U';
};

export const roleLabel = (role?: string): string => {
  const r = (role || '').toLowerCase();
  if (!r) return 'User';
  return r.charAt(0).toUpperCase() + r.slice(1);
};

export interface RoleTone {
  bg: string;
  fg: string;
}

/**
 * Avatar / chip tint by role. Tutors take the teal slot, students the brand
 * purple, admins amber — the same three accents as the dashboard tiles, so a
 * colour means the same thing everywhere in the panel.
 */
export const roleTone = (role?: string, isDark = false): RoleTone => {
  switch ((role || '').toLowerCase()) {
    case 'tutor':
    case 'teacher':
      return isDark
        ? { bg: 'rgba(14, 165, 164, 0.22)', fg: '#5EEAD4' }
        : { bg: 'rgba(14, 165, 164, 0.15)', fg: '#0B8483' };
    case 'student':
      return isDark
        ? { bg: 'rgba(112, 71, 235, 0.26)', fg: '#C4B5FD' }
        : { bg: 'rgba(112, 71, 235, 0.14)', fg: '#5B36D6' };
    case 'admin':
      return isDark
        ? { bg: 'rgba(201, 133, 0, 0.24)', fg: '#FCD34D' }
        : { bg: 'rgba(201, 133, 0, 0.16)', fg: '#8A5A00' };
    default:
      return {
        bg: 'var(--nextui-colors-accents1)',
        fg: 'var(--nextui-colors-accents7)',
      };
  }
};

export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Conversation-list timestamp: "09:16 PM", "Yesterday", "Mon", "Aug 3". */
export const formatListDate = (iso?: string): string => {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  if (isSameDay(date, now)) return formatTime(iso);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';

  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/** Thread date separator: "Today", "Yesterday", "Friday, 21 August". */
export const dateLabel = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  if (isSameDay(date, now)) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

/** Everyone in the thread except the current user (or the first person, if alone). */
export const conversationPeople = (conv: any, currentUserId: any): any[] => {
  const participants: any[] = conv?.participants ?? [];
  const others = participants.filter((p) => !isSameId(p?._id, currentUserId));
  return others.length ? others : participants.slice(0, 1);
};

export const conversationTitle = (people: any[]): string =>
  people.map(nameOf).join(' & ') || 'User';

/** Conversations whose participant names or last message contain the query. */
export const filterConversations = (
  conversations: any[],
  query: string,
  currentUserId: any,
): any[] => {
  const q = query.trim().toLowerCase();
  if (!q) return conversations;
  return conversations.filter((conv) => {
    const title = conversationTitle(conversationPeople(conv, currentUserId)).toLowerCase();
    const preview = String(conv.lastMessage?.content ?? '').toLowerCase();
    return title.includes(q) || preview.includes(q);
  });
};

/**
 * Who sent this? REST messages may carry a populated sender; socket messages
 * carry a bare id, which is looked up in the thread's participants.
 */
export const resolveSender = (msg: any, participants: any[]): any | null => {
  if (msg?.senderId && typeof msg.senderId === 'object') return msg.senderId;
  return participants.find((p) => isSameId(p?._id, msg?.senderId)) ?? null;
};

/**
 * A run is consecutive messages from one sender on one day. The first bubble
 * of a run carries the sender's name, the last carries the avatar and tail.
 */
export const runBoundaries = (
  messages: any[],
  index: number,
): { startsRun: boolean; endsRun: boolean } => {
  const msg = messages[index];
  const sameRun = (other: any): boolean => {
    if (!other || !isSameId(other.senderId, msg.senderId)) return false;
    if (other.createdAt && msg.createdAt) {
      return dateLabel(other.createdAt) === dateLabel(msg.createdAt);
    }
    return true;
  };
  return {
    startsRun: !sameRun(messages[index - 1]),
    endsRun: !sameRun(messages[index + 1]),
  };
};
