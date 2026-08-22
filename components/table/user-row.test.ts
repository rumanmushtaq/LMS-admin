import { describe, it, expect } from 'vitest';
import {
   toRow,
   extractUsers,
   roleLabel,
   initials,
   colorFor,
   formatJoined,
   routeForRole,
   AVATAR_COLORS,
} from './user-row';

describe('toRow', () => {
   it('prefers fullName, then firstName+lastName, then the email local part', () => {
      expect(toRow({ fullName: 'Ada Lovelace' }).name).toBe('Ada Lovelace');
      expect(toRow({ firstName: 'Ada', lastName: 'Lovelace' }).name).toBe(
         'Ada Lovelace',
      );
      expect(toRow({ email: 'ada@example.com' }).name).toBe('ada');
      expect(toRow({}).name).toBe('User');
   });

   it('normalises id from _id or id and copies core fields', () => {
      const row = toRow({
         _id: 'abc',
         email: 'a@b.com',
         role: 'tutor',
         status: 'pending',
         createdAt: '2026-01-01',
      });
      expect(row).toEqual({
         id: 'abc',
         name: 'a',
         email: 'a@b.com',
         role: 'tutor',
         status: 'pending',
         createdAt: '2026-01-01',
      });
   });

   it('defaults status to active and leaves role blank when absent', () => {
      const row = toRow({ _id: '1', email: 'x@y.com' });
      expect(row.status).toBe('active');
      expect(row.role).toBe('');
   });

   it('trims a half-present name without a stray space', () => {
      expect(toRow({ firstName: 'Grace' }).name).toBe('Grace');
   });
});

describe('extractUsers', () => {
   const users = [{ _id: '1' }, { _id: '2' }];

   it('reads a { success, data: { users } } envelope', () => {
      expect(extractUsers({ success: true, data: { users } })).toBe(users);
   });
   it('reads a bare paginated object { users }', () => {
      expect(extractUsers({ users })).toBe(users);
   });
   it('reads a { data: [...] } array', () => {
      expect(extractUsers({ data: users })).toBe(users);
   });
   it('reads a bare array', () => {
      expect(extractUsers(users)).toBe(users);
   });
   it('returns [] for null/garbage shapes', () => {
      expect(extractUsers(null)).toEqual([]);
      expect(extractUsers({ foo: 'bar' })).toEqual([]);
   });
});

describe('roleLabel', () => {
   it('maps API roles to display labels', () => {
      expect(roleLabel('tutor')).toBe('Teacher');
      expect(roleLabel('student')).toBe('Student');
      expect(roleLabel('admin')).toBe('Admin');
   });
   it('passes through an unknown role and dashes an empty one', () => {
      expect(roleLabel('moderator')).toBe('moderator');
      expect(roleLabel('')).toBe('—');
      expect(roleLabel(undefined)).toBe('—');
   });
});

describe('initials', () => {
   it('takes up to two uppercase initials', () => {
      expect(initials('Ada Lovelace')).toBe('AL');
      expect(initials('grace hopper jones')).toBe('GH');
      expect(initials('Cher')).toBe('C');
   });
   it('falls back to U for an empty name', () => {
      expect(initials('')).toBe('U');
      expect(initials('   ')).toBe('U');
   });
});

describe('colorFor', () => {
   it('is deterministic for the same name', () => {
      expect(colorFor('Ada Lovelace')).toBe(colorFor('Ada Lovelace'));
   });
   it('always returns a colour from the palette', () => {
      for (const n of ['a', 'bob', 'Zebra', 'x@y.com', '']) {
         expect(AVATAR_COLORS).toContainEqual(colorFor(n));
      }
   });
});

describe('formatJoined', () => {
   it('formats a valid ISO date', () => {
      // Order/separators depend on the runtime locale, so assert on the parts,
      // not a fixed layout. Midday UTC avoids a day slipping across a boundary.
      const out = formatJoined('2026-06-12T12:00:00.000Z');
      expect(out.startsWith('Joined ')).toBe(true);
      expect(out).toContain('12');
      expect(out).toContain('Jun');
      expect(out).toContain('2026');
   });
   it('dashes a missing or invalid date', () => {
      expect(formatJoined(undefined)).toBe('—');
      expect(formatJoined('not-a-date')).toBe('—');
   });
});

describe('routeForRole', () => {
   it('routes by role, defaulting to /accounts', () => {
      expect(routeForRole('tutor')).toBe('/teachers');
      expect(routeForRole('student')).toBe('/students');
      expect(routeForRole('admin')).toBe('/accounts');
      expect(routeForRole('')).toBe('/accounts');
   });
});
