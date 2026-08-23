import { describe, it, expect } from 'vitest';
import {
  idOf,
  isSameId,
  nameOf,
  initialsOf,
  roleLabel,
  roleTone,
  formatTime,
  formatListDate,
  dateLabel,
  conversationPeople,
  conversationTitle,
  filterConversations,
  resolveSender,
  runBoundaries,
} from './presentation';

const daysAgo = (n: number, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

describe('idOf / isSameId', () => {
  it('reads the id from a populated document, an {id} object, or a bare string', () => {
    expect(idOf({ _id: 'a1' })).toBe('a1');
    expect(idOf({ id: 'a2' })).toBe('a2');
    expect(idOf('a3')).toBe('a3');
    expect(idOf(null)).toBe('');
  });

  it('treats a populated sender and a bare socket id as the same user', () => {
    expect(isSameId({ _id: 'u1' }, 'u1')).toBe(true);
    expect(isSameId('u1', { id: 'u1' })).toBe(true);
  });

  it('never matches two missing ids', () => {
    expect(isSameId(undefined, null)).toBe(false);
    expect(isSameId('', '')).toBe(false);
  });
});

describe('nameOf', () => {
  it('joins first and last name and trims a missing half', () => {
    expect(nameOf({ firstName: 'tutor', lastName: 'first' })).toBe('tutor first');
    expect(nameOf({ firstName: 'Hamid' })).toBe('Hamid');
  });

  it('falls back to fullName, then the email local part, then "User"', () => {
    expect(nameOf({ fullName: 'Super Admin' })).toBe('Super Admin');
    expect(nameOf({ email: 'jane.doe@example.com' })).toBe('jane.doe');
    expect(nameOf(null)).toBe('User');
  });
});

describe('initialsOf', () => {
  it('takes the first letter of the first two words, upper-cased', () => {
    expect(initialsOf('tutor first')).toBe('TF');
    expect(initialsOf('first 1122 student')).toBe('F1');
    expect(initialsOf('Hamid')).toBe('H');
  });

  it('uses U when there is no name', () => {
    expect(initialsOf('')).toBe('U');
  });
});

describe('roleLabel', () => {
  it('capitalises the role and defaults to User', () => {
    expect(roleLabel('tutor')).toBe('Tutor');
    expect(roleLabel('ADMIN')).toBe('Admin');
    expect(roleLabel(undefined)).toBe('User');
  });
});

describe('roleTone', () => {
  it('gives tutors, students and admins distinct tints', () => {
    const tints = new Set(['tutor', 'student', 'admin'].map((r) => roleTone(r).bg));
    expect(tints.size).toBe(3);
  });

  it('treats "teacher" as a tutor', () => {
    expect(roleTone('teacher')).toEqual(roleTone('tutor'));
  });

  it('brightens the ink on a dark surface', () => {
    expect(roleTone('tutor', true).fg).not.toBe(roleTone('tutor', false).fg);
  });

  it('falls back to theme tokens for an unknown role', () => {
    expect(roleTone('moderator').bg).toContain('--nextui-colors-');
  });
});

describe('formatListDate', () => {
  it('shows the clock time for today', () => {
    const iso = daysAgo(0, 9);
    expect(formatListDate(iso)).toBe(formatTime(iso));
  });

  it('says Yesterday for yesterday', () => {
    expect(formatListDate(daysAgo(1))).toBe('Yesterday');
  });

  it('shows the weekday inside the last week', () => {
    const iso = daysAgo(3);
    expect(formatListDate(iso)).toBe(
      new Date(iso).toLocaleDateString([], { weekday: 'short' }),
    );
  });

  it('shows month and day beyond a week', () => {
    const iso = daysAgo(30);
    expect(formatListDate(iso)).toBe(
      new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    );
  });

  it('is empty for a missing date', () => {
    expect(formatListDate(undefined)).toBe('');
  });
});

describe('dateLabel', () => {
  it('labels today and yesterday by name', () => {
    expect(dateLabel(daysAgo(0))).toBe('Today');
    expect(dateLabel(daysAgo(1))).toBe('Yesterday');
  });

  it('spells out older dates with weekday and month', () => {
    const iso = daysAgo(10);
    const label = dateLabel(iso);
    expect(label).toContain(new Date(iso).toLocaleDateString([], { weekday: 'long' }));
    expect(label).toContain(new Date(iso).toLocaleDateString([], { month: 'long' }));
  });
});

describe('conversationPeople / conversationTitle', () => {
  const me = { _id: 'admin' };
  const tutor = { _id: 't1', firstName: 'tutor', lastName: 'first', role: 'tutor' };
  const student = { _id: 's1', firstName: 'first 1122', lastName: 'student', role: 'student' };

  it('drops the current user from the people shown', () => {
    const conv = { participants: [me, tutor, student] };
    expect(conversationPeople(conv, 'admin')).toEqual([tutor, student]);
  });

  it('keeps the first participant when the admin is the only one', () => {
    expect(conversationPeople({ participants: [me] }, 'admin')).toEqual([me]);
  });

  it('copes with a missing participants list', () => {
    expect(conversationPeople({}, 'admin')).toEqual([]);
  });

  it('joins names with an ampersand and defaults to User', () => {
    expect(conversationTitle([tutor, student])).toBe('tutor first & first 1122 student');
    expect(conversationTitle([])).toBe('User');
  });
});

describe('filterConversations', () => {
  const convs = [
    { _id: 'c1', participants: [{ _id: 't1', firstName: 'Tutor', lastName: 'Nine' }], lastMessage: { content: 'see you at 3' } },
    { _id: 'c2', participants: [{ _id: 's1', firstName: 'Hamid', lastName: 'Ali' }], lastMessage: { content: 'thanks!' } },
  ];

  it('returns the same list when the query is blank', () => {
    expect(filterConversations(convs, '   ', 'admin')).toBe(convs);
  });

  it('matches a participant name case-insensitively', () => {
    expect(filterConversations(convs, 'hamid', 'admin').map((c) => c._id)).toEqual(['c2']);
  });

  it('matches the last message preview', () => {
    expect(filterConversations(convs, 'at 3', 'admin').map((c) => c._id)).toEqual(['c1']);
  });

  it('returns nothing when nothing matches', () => {
    expect(filterConversations(convs, 'zzz', 'admin')).toEqual([]);
  });
});

describe('resolveSender', () => {
  const participants = [
    { _id: 't1', firstName: 'tutor', role: 'tutor' },
    { _id: 's1', firstName: 'student', role: 'student' },
  ];

  it('returns a populated sender as-is', () => {
    const populated = { _id: 't1', firstName: 'tutor' };
    expect(resolveSender({ senderId: populated }, participants)).toBe(populated);
  });

  it('looks a bare socket id up in the participants', () => {
    expect(resolveSender({ senderId: 's1' }, participants)).toBe(participants[1]);
  });

  it('returns null for an unknown sender', () => {
    expect(resolveSender({ senderId: 'ghost' }, participants)).toBeNull();
  });
});

describe('runBoundaries', () => {
  const t = daysAgo(0, 10);
  const msgs = [
    { senderId: 'u1', createdAt: t },
    { senderId: 'u1', createdAt: t },
    { senderId: 'u2', createdAt: t },
  ];

  it('marks the first and last message of a same-sender run', () => {
    expect(runBoundaries(msgs, 0)).toEqual({ startsRun: true, endsRun: false });
    expect(runBoundaries(msgs, 1)).toEqual({ startsRun: false, endsRun: true });
  });

  it('makes a lone message both start and end', () => {
    expect(runBoundaries(msgs, 2)).toEqual({ startsRun: true, endsRun: true });
  });

  it('splits a run when the day changes', () => {
    const acrossDays = [
      { senderId: 'u1', createdAt: daysAgo(1) },
      { senderId: 'u1', createdAt: daysAgo(0) },
    ];
    expect(runBoundaries(acrossDays, 0).endsRun).toBe(true);
    expect(runBoundaries(acrossDays, 1).startsRun).toBe(true);
  });

  it('matches populated and bare sender ids within one run', () => {
    const mixed = [
      { senderId: { _id: 'u1' }, createdAt: t },
      { senderId: 'u1', createdAt: t },
    ];
    expect(runBoundaries(mixed, 0).endsRun).toBe(false);
  });
});
