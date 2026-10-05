import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserAvatar, PeopleAvatar, RoleChips } from './avatar';

const tutor = { _id: 't1', firstName: 'tutor', lastName: 'first', role: 'tutor' };
const student = { _id: 's1', firstName: 'first 1122', lastName: 'student', role: 'student' };

describe('UserAvatar', () => {
  it('shows the initials and names the person with their role in the title', () => {
    const html = renderToStaticMarkup(<UserAvatar user={tutor} />);
    expect(html).toContain('>TF<');
    expect(html).toContain('title="tutor first · Tutor"');
  });

  it('draws a presence dot only when online state is given', () => {
    expect(renderToStaticMarkup(<UserAvatar user={tutor} />)).not.toContain('aria-label="Online"');
    expect(renderToStaticMarkup(<UserAvatar user={tutor} online />)).toContain('aria-label="Online"');
    expect(renderToStaticMarkup(<UserAvatar user={tutor} online={false} />)).toContain('aria-label="Offline"');
  });
});

describe('PeopleAvatar', () => {
  it('stacks two avatars for a two-person thread', () => {
    const html = renderToStaticMarkup(<PeopleAvatar people={[tutor, student]} />);
    expect(html).toContain('>TF<');
    expect(html).toContain('>F1<');
  });

  it('shows a single avatar for one person', () => {
    const html = renderToStaticMarkup(<PeopleAvatar people={[student]} online />);
    expect(html).toContain('>F1<');
    expect(html).not.toContain('>TF<');
    expect(html).toContain('aria-label="Online"');
  });
});

describe('RoleChips', () => {
  it('renders one capitalised chip per person', () => {
    const html = renderToStaticMarkup(<RoleChips people={[tutor, student]} />);
    expect(html).toContain('>Tutor<');
    expect(html).toContain('>Student<');
  });
});
