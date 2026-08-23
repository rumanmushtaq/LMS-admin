import type { Props } from "react-apexcharts";
import { SERIES, baseOptions, formatNumber, type ChartInk } from "./theme";

/** Teachers take slot 1 (purple), students slot 2 (teal). */
export const GROWTH_COLORS = [SERIES.purple, SERIES.teal];

/** Smallest "round" number ≥ v: 1, 2, 2.5, 5 or 10 × a power of ten. */
export const niceCeil = (v: number): number => {
  if (v <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(v));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * magnitude >= v) return step * magnitude;
  }
  return 10 * magnitude;
};

export interface GrowthInput {
  categories: string[];
  teachers?: number[];
  students?: number[];
  ink: ChartInk;
}

export interface GrowthOutput {
  options: NonNullable<Props["options"]>;
  series: NonNullable<Props["series"]>;
  /** Last value of each line: [teachers, students]. */
  ends: [number, number];
}

/**
 * Everything ApexCharts needs for the teachers-vs-students growth chart,
 * as plain data so it can be tested without a browser.
 */
export const buildGrowthOptions = ({
  categories,
  teachers,
  students,
  ink,
}: GrowthInput): GrowthOutput => {
  const zeros = () => new Array(categories.length).fill(0);
  const teacherData = teachers?.length ? teachers : zeros();
  const studentData = students?.length ? students : zeros();

  const last = categories.length - 1;
  const ends: [number, number] = [teacherData[last] ?? 0, studentData[last] ?? 0];
  const maxY = Math.max(1, ...teacherData, ...studentData);

  // Endpoint labels: above the point by default. A point at the top of the
  // plot has no room above it, so its label drops below; and when the two
  // lines finish close together the higher one keeps the near slot and the
  // lower one moves one step further so they never stack on each other.
  const converge = Math.abs(ends[0] - ends[1]) / maxY < 0.12;
  const higher = ends[0] >= ends[1] ? 0 : 1;
  const labelOffset = (i: number): number => {
    const nearTop = ends[i] >= maxY * 0.88;
    if (!converge) return nearTop ? 24 : -4;
    if (i === higher) return nearTop ? 24 : -6;
    return nearTop ? 44 : 26;
  };

  const base = baseOptions("growth-chart", ink, GROWTH_COLORS);
  const options: NonNullable<Props["options"]> = {
    ...base,
    xaxis: { ...base?.xaxis, categories },
    // Headroom above the highest line: the endpoint label needs the space,
    // and ApexCharts drops a point annotation that sits exactly on the axis
    // maximum, so the top line would otherwise lose its label entirely.
    yaxis: {
      ...(base?.yaxis as object),
      forceNiceScale: false,
      max: niceCeil(maxY * 1.15),
      tickAmount: 5,
    },
    grid: {
      ...base?.grid,
      // Room on the right for the endpoint labels.
      padding: { top: 8, right: 28, bottom: 0, left: 8 },
    },
    annotations: {
      points: ends.map((y, i) => ({
        x: categories[last],
        y,
        marker: {
          size: 4,
          fillColor: GROWTH_COLORS[i],
          strokeColor: ink.surface,
          strokeWidth: 2,
        },
        label: {
          text: formatNumber(y),
          borderWidth: 0,
          offsetY: labelOffset(i),
          style: {
            background: "transparent",
            color: ink.primary,
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "Inter, system-ui, sans-serif",
            padding: { left: 2, right: 2, top: 0, bottom: 0 },
          },
        },
      })),
    },
  };

  const series: NonNullable<Props["series"]> = [
    { name: "Teachers", data: teacherData },
    { name: "Students", data: studentData },
  ];

  return { options, series, ends };
};
