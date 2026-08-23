import { describe, it, expect } from 'vitest';
import { describeSpan } from './describe-span';

const hoursApart = (n: number) =>
  Array.from({ length: n + 1 }, (_, i) => ({
    hour: new Date(Date.UTC(2026, 7, 20, i)).toISOString(),
  }));

describe('describeSpan', () => {
  it('describes windows under two days in hours', () => {
    expect(describeSpan(hoursApart(9))).toBe('9 hours');
    expect(describeSpan(hoursApart(47))).toBe('47 hours');
  });

  it('switches to days from 48 hours', () => {
    expect(describeSpan(hoursApart(48))).toBe('2 days');
    expect(describeSpan(hoursApart(72))).toBe('3 days');
  });

  it('uses the singular for a single hour and for a single point', () => {
    expect(describeSpan(hoursApart(1))).toBe('1 hour');
    expect(describeSpan(hoursApart(0))).toBe('1 hour');
  });

  it('measures from the timestamps, not the number of points', () => {
    const sparse = [
      { hour: '2026-08-20T00:00:00.000Z' },
      { hour: '2026-08-23T00:00:00.000Z' },
    ];
    expect(describeSpan(sparse)).toBe('3 days');
  });
});
