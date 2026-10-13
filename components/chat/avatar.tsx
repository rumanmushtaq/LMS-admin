import React from 'react';
import { useTheme } from '@nextui-org/react';
import { initialsOf, nameOf, roleLabel, roleTone } from '../../lib/chat/presentation';

interface UserAvatarProps {
  user: any;
  size?: number;
  /** When given, draws a presence dot: green online, grey offline. */
  online?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Initials on a role-tinted disc. */
export const UserAvatar = ({ user, size = 40, online, className, style }: UserAvatarProps) => {
  const { isDark } = useTheme();
  const name = nameOf(user);
  const tone = roleTone(user?.role, !!isDark);
  const dot = Math.max(8, Math.round(size * 0.26));

  return (
    <div
      className={`relative shrink-0 ${className ?? ''}`}
      style={{ width: size, height: size, ...style }}
      title={`${name} · ${roleLabel(user?.role)}`}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold select-none"
        style={{ background: tone.bg, color: tone.fg, fontSize: Math.round(size * 0.36) }}
        aria-hidden="true"
      >
        {initialsOf(name)}
      </div>
      {online !== undefined && (
        <span
          className="absolute rounded-full ring-2 ring-[var(--nextui-colors-backgroundContrast)]"
          style={{
            width: dot,
            height: dot,
            right: -1,
            bottom: -1,
            background: online ? '#0CA30C' : 'var(--nextui-colors-accents4)',
          }}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

interface PeopleAvatarProps {
  people: any[];
  size?: number;
  online?: boolean;
}

/**
 * One person → their avatar. Two → a stacked pair, so a tutor↔student thread
 * is recognisable in the list before the name is read.
 */
export const PeopleAvatar = ({ people, size = 40, online }: PeopleAvatarProps) => {
  if (people.length >= 2) {
    const small = Math.round(size * 0.74);
    return (
      // Overlapped pair that fans apart on hover so both faces read clearly.
      <div
        className="group/av relative flex shrink-0 items-center"
        style={{ height: size }}
        title={`${nameOf(people[0])} · ${nameOf(people[1])}`}
      >
        <UserAvatar
          user={people[0]}
          size={small}
          className="rounded-full ring-2 ring-[var(--nextui-colors-backgroundContrast)] transition-all duration-200 group-hover/av:-translate-y-0.5"
        />
        <UserAvatar
          user={people[1]}
          size={small}
          className="-ml-3.5 rounded-full ring-2 ring-[var(--nextui-colors-backgroundContrast)] transition-all duration-200 group-hover/av:ml-1 group-hover/av:-translate-y-0.5"
        />
      </div>
    );
  }
  return <UserAvatar user={people[0]} size={size} online={online} />;
};

/** Small role chips for a set of people: "Tutor · Student". */
export const RoleChips = ({ people }: { people: any[] }) => {
  const { isDark } = useTheme();
  return (
  <span className="inline-flex items-center gap-1 min-w-0">
    {people.map((p, i) => {
      const tone = roleTone(p?.role, !!isDark);
      return (
        <span
          key={`${p?._id ?? i}`}
          className="text-[10px] font-semibold leading-none px-1.5 py-[3px] rounded-md whitespace-nowrap"
          style={{ background: tone.bg, color: tone.fg }}
        >
          {roleLabel(p?.role)}
        </span>
      );
    })}
  </span>
  );
};
