import { describe, it, expect } from 'vitest';
import { SERIES, inkFor, formatNumber, buildTooltip, baseOptions } from './theme';

const w = {
  globals: {
    categoryLabels: ['Jan', 'Feb'],
    colors: ['#111111', '#222222'],
    seriesNames: ['Teachers', '<b>Evil</b>'],
  },
};

describe('formatNumber', () => {
  it('rounds and groups thousands', () => {
    expect(formatNumber(1284.4)).toBe((1284).toLocaleString());
    expect(formatNumber(0)).toBe('0');
  });
});

describe('buildTooltip', () => {
  const ink = inkFor(false);

  it('lists every series at the hovered point with the category as title', () => {
    const html = buildTooltip(ink)({ series: [[1, 2], [3, 4]], dataPointIndex: 1, w });
    expect(html).toContain('Feb');
    expect(html).toContain('Teachers');
    expect(html).toContain('#111111');
    expect(html).toContain('#222222');
  });

  it('puts the value before the series name', () => {
    const html = buildTooltip(ink)({ series: [[7]], dataPointIndex: 0, w });
    expect(html.indexOf('>7<')).toBeGreaterThan(-1);
    expect(html.indexOf('>7<')).toBeLessThan(html.indexOf('Teachers'));
  });

  it('escapes series names so API data cannot inject markup', () => {
    const html = buildTooltip(ink)({ series: [[1], [2]], dataPointIndex: 0, w });
    expect(html).not.toContain('<b>Evil</b>');
    expect(html).toContain('&lt;b&gt;Evil&lt;/b&gt;');
  });

  it('skips a series that has no value at that point', () => {
    const html = buildTooltip(ink)({ series: [[1, 2], [3, null]], dataPointIndex: 1, w });
    expect(html).not.toContain('Evil');
  });

  it('applies a custom value formatter', () => {
    const html = buildTooltip(ink, (v) => `${v} total`)({ series: [[5]], dataPointIndex: 0, w });
    expect(html).toContain('5 total');
  });

  it('carries the theme ink into the tooltip surface', () => {
    const dark = inkFor(true);
    const html = buildTooltip(dark)({ series: [[1]], dataPointIndex: 0, w });
    expect(html).toContain(`--vz-surface:${dark.surface}`);
  });
});

describe('baseOptions', () => {
  const ink = inkFor(false);
  const options = baseOptions('test', ink, [SERIES.purple, SERIES.teal]);

  it('draws thin 2px lines and passes the series colours through', () => {
    expect(options?.stroke?.width).toBe(2);
    expect(options?.colors).toEqual([SERIES.purple, SERIES.teal]);
  });

  it('uses solid horizontal hairlines only — no dashes, no vertical grid', () => {
    expect(options?.grid?.strokeDashArray).toBe(0);
    expect(options?.grid?.xaxis?.lines?.show).toBe(false);
    expect(options?.grid?.yaxis?.lines?.show).toBe(true);
  });

  it('hides the built-in legend and toolbar (the card renders its own legend)', () => {
    expect(options?.legend?.show).toBe(false);
    expect(options?.chart?.toolbar?.show).toBe(false);
  });

  it('rings hover markers in the surface colour of the current theme', () => {
    const dark = baseOptions('t', inkFor(true), ['#000']);
    expect(dark?.markers?.strokeColors).toBe(inkFor(true).surface);
  });

  it('ships a shared, non-intersecting custom tooltip', () => {
    expect(options?.tooltip?.shared).toBe(true);
    expect(options?.tooltip?.intersect).toBe(false);
    expect(typeof options?.tooltip?.custom).toBe('function');
  });
});

describe('inkFor', () => {
  it('selects a different surface and ink per theme', () => {
    expect(inkFor(true).surface).not.toBe(inkFor(false).surface);
    expect(inkFor(true).primary).not.toBe(inkFor(false).primary);
  });
});
