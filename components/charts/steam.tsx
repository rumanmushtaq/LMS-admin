import React from "react";
import Chart, { Props } from "react-apexcharts";
import { useTheme } from "@nextui-org/react";
import { SERIES, inkFor, baseOptions, formatNumber } from "./theme";
import { ChartCard } from "./ChartCard";
import { ChartLegend } from "./ChartLegend";

export interface SteamProps {
  categories?: string[];
  teachers?: number[];
  students?: number[];
  teacherDelta?: number;
  studentDelta?: number;
}

const FALLBACK_CATEGORIES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const COLORS = [SERIES.purple, SERIES.teal];

const deltaHint = (delta?: number): string | undefined => {
  if (!delta) return undefined;
  return `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta))} this month`;
};

/**
 * Teachers vs students, cumulative over the last 12 months.
 *
 * Two thin lines on one axis; each is named by its endpoint value, and the
 * legend repeats that value so the headline is readable without hovering.
 */
export const Steam = ({
  categories,
  teachers,
  students,
  teacherDelta,
  studentDelta,
}: SteamProps) => {
  const { isDark } = useTheme();
  const ink = inkFor(!!isDark);

  const cats = categories?.length ? categories : FALLBACK_CATEGORIES;
  const teacherData = teachers?.length ? teachers : new Array(cats.length).fill(0);
  const studentData = students?.length ? students : new Array(cats.length).fill(0);

  const last = cats.length - 1;
  const ends = [teacherData[last] ?? 0, studentData[last] ?? 0];
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

  const base = baseOptions("growth-chart", ink, COLORS);
  const options: Props["options"] = {
    ...base,
    xaxis: { ...base?.xaxis, categories: cats },
    grid: {
      ...base?.grid,
      // Room on the right for the endpoint labels.
      padding: { top: 8, right: 28, bottom: 0, left: 8 },
    },
    annotations: {
      points: ends.map((y, i) => ({
        x: cats[last],
        y,
        marker: {
          size: 4,
          fillColor: COLORS[i],
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

  const series: Props["series"] = [
    { name: "Teachers", data: teacherData },
    { name: "Students", data: studentData },
  ];

  return (
    <ChartCard
      title="Teachers vs students"
      subtitle="Cumulative registrations, last 12 months"
      aside={
        <ChartLegend
          ink={ink}
          items={[
            {
              name: "Teachers",
              color: COLORS[0],
              value: formatNumber(ends[0]),
              hint: deltaHint(teacherDelta),
            },
            {
              name: "Students",
              color: COLORS[1],
              value: formatNumber(ends[1]),
              hint: deltaHint(studentDelta),
            },
          ]}
        />
      }
    >
      <Chart options={options} series={series} type="area" height={320} />
    </ChartCard>
  );
};
