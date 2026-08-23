import { describe, it, expect } from 'vitest';
import { niceCeil, buildGrowthOptions } from './growth-options';
import { inkFor } from './theme';

const ink = inkFor(false);
const cats = ['Jan', 'Feb', 'Mar'];

const pointLabels = (options: any) =>
  (options.annotations.points as any[]).map((p) => ({
    x: p.x,
    y: p.y,
    offsetY: p.label.offsetY,
  }));

describe('niceCeil', () => {
  it('rounds up to 1 / 2 / 2.5 / 5 / 10 × a power of ten', () => {
    expect(niceCeil(23)).toBe(25);
    expect(niceCeil(20)).toBe(20);
    expect(niceCeil(7)).toBe(10);
    expect(niceCeil(101)).toBe(200);
    expect(niceCeil(1500)).toBe(2000);
    expect(niceCeil(0.4)).toBe(0.5);
  });

  it('never returns zero', () => {
    expect(niceCeil(0)).toBe(1);
    expect(niceCeil(-5)).toBe(1);
  });
});

describe('buildGrowthOptions', () => {
  it('leaves headroom above the highest line so the top label can render', () => {
    const { options } = buildGrowthOptions({ categories: cats, teachers: [0, 10, 20], students: [0, 5, 11], ink });
    const yaxis = options.yaxis as any;
    expect(yaxis.max).toBeGreaterThan(20);
    expect(yaxis.max).toBe(25);
  });

  it('labels the endpoint of each line at the last category', () => {
    const { options } = buildGrowthOptions({ categories: cats, teachers: [0, 10, 20], students: [0, 5, 11], ink });
    expect(pointLabels(options)).toMatchObject([
      { x: 'Mar', y: 20 },
      { x: 'Mar', y: 11 },
    ]);
  });

  it('drops the label below the point when the line ends near the top', () => {
    const { options } = buildGrowthOptions({ categories: cats, teachers: [0, 10, 20], students: [0, 2, 5], ink });
    const [teachers, students] = pointLabels(options);
    expect(teachers.offsetY).toBeGreaterThan(0);
    expect(students.offsetY).toBeLessThan(0);
  });

  it('separates the two labels when the lines finish close together', () => {
    const { options } = buildGrowthOptions({ categories: cats, teachers: [0, 5, 10], students: [0, 4, 9], ink });
    const [teachers, students] = pointLabels(options);
    expect(teachers.offsetY).not.toBe(students.offsetY);
  });

  it('fills a missing series with zeros of the right length', () => {
    const { series, ends } = buildGrowthOptions({ categories: cats, teachers: undefined, students: [1, 2, 3], ink });
    expect((series[0] as any).data).toEqual([0, 0, 0]);
    expect(ends).toEqual([0, 3]);
  });

  it('uses the category axis and theme ink', () => {
    const { options } = buildGrowthOptions({ categories: cats, teachers: [1, 2, 3], students: [1, 1, 1], ink });
    expect((options.xaxis as any).categories).toEqual(cats);
    expect((options.annotations!.points as any[])[0].marker.strokeColor).toBe(ink.surface);
  });
});
