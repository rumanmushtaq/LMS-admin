import { RowUser } from './data';

/**
 * Pure helpers behind the users table, kept free of React/NextUI so they can
 * be unit-tested in isolation and reused by both the cell renderer and the
 * table container.
 */

export const ROLE_LABELS: Record<string, string> = {
   tutor: 'Teacher',
   student: 'Student',
   admin: 'Admin',
};

export const roleLabel = (role?: string): string =>
   (role && ROLE_LABELS[role]) || role || '—';

/** Map a raw API user (whatever shape) into the row the table renders. */
export const toRow = (u: any): RowUser => {
   const name =
      (u?.fullName && String(u.fullName).trim()) ||
      `${u?.firstName || ''} ${u?.lastName || ''}`.trim() ||
      (u?.email ? String(u.email).split('@')[0] : 'User');
   return {
      id: String(u?._id || u?.id || ''),
      name,
      email: u?.email || '',
      role: u?.role || '',
      status: u?.status || 'active',
      createdAt: u?.createdAt,
   };
};

/**
 * The users endpoint may return the paginated object directly or wrapped in
 * `{ success, data }`. Pull the users array out of whichever shape arrives.
 */
export const extractUsers = (res: any): any[] => {
   const body = res?.data?.users ? res.data : res;
   if (Array.isArray(body?.users)) return body.users;
   if (Array.isArray(body?.data?.users)) return body.data.users;
   if (Array.isArray(body?.data)) return body.data;
   if (Array.isArray(body)) return body;
   return [];
};

/** Up to two uppercase initials for the avatar, falling back to 'U'. */
export const initials = (name: string): string =>
   name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('') || 'U';

export const AVATAR_COLORS = [
   { bg: '#EDE9FE', fg: '#6D28D9' },
   { bg: '#DBEAFE', fg: '#1D4ED8' },
   { bg: '#DCFCE7', fg: '#15803D' },
   { bg: '#FEF3C7', fg: '#B45309' },
   { bg: '#FCE7F3', fg: '#BE185D' },
   { bg: '#CFFAFE', fg: '#0E7490' },
];

/** Deterministic avatar colour per name, so a user keeps the same colour. */
export const colorFor = (name: string) => {
   let h = 0;
   for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
   return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

/** "Joined 12 Jun 2026", or an em dash for a missing/invalid date. */
export const formatJoined = (iso?: string): string => {
   if (!iso) return '—';
   const d = new Date(iso);
   if (isNaN(d.getTime())) return '—';
   return `Joined ${d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
   })}`;
};

/** Route to the management page appropriate for a user's role. */
export const routeForRole = (role: string): string =>
   role === 'tutor'
      ? '/teachers'
      : role === 'student'
        ? '/students'
        : '/accounts';
