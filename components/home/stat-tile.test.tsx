import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatTile } from './stat-tile';

const render = (props: Partial<React.ComponentProps<typeof StatTile>>) =>
  renderToStaticMarkup(
    <StatTile label="Total teachers" value={20} accent="purple" icon={<svg />} {...props} />,
  );

describe('StatTile', () => {
  it('shows the label and a thousands-grouped value', () => {
    const html = render({ value: 1284 });
    expect(html).toContain('Total teachers');
    expect(html).toContain((1284).toLocaleString());
  });

  it('renders a rising delta with an up arrow and the period', () => {
    const html = render({ delta: { value: 3, period: 'this month' } });
    expect(html).toContain('↑ 3');
    expect(html).toContain('this month');
    expect(html).not.toContain('No change');
  });

  it('says "No change" instead of "↑ 0" for a flat delta', () => {
    const html = render({ delta: { value: 0, period: 'this month' } });
    expect(html).toContain('No change');
    expect(html).not.toContain('↑');
  });

  it('renders a falling delta with a down arrow and the absolute value', () => {
    const html = render({ delta: { value: -2, period: 'this month' } });
    expect(html).toContain('↓ 2');
    expect(html).not.toContain('-2');
  });

  it('omits the pill entirely when there is no delta', () => {
    const html = render({});
    expect(html).not.toContain('↑');
    expect(html).not.toContain('No change');
  });

  it('renders the hint line and caption when given', () => {
    const html = render({ caption: 'Registered', hint: { text: '5 active users', tone: 'good' } });
    expect(html).toContain('Registered');
    expect(html).toContain('5 active users');
  });
});
