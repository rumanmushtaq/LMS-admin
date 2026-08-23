import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@nextui-org/react";
import { inkFor, formatNumber } from "./theme";
import { buildGrowthOptions, GROWTH_COLORS } from "./growth-options";
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

const deltaHint = (delta?: number): string | undefined => {
  if (!delta) return undefined;
  return `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta))} this month`;
};

/**
 * Teachers vs students, cumulative over the last 12 months.
 *
 * Two thin lines on one axis; each is named by its endpoint value, and the
 * legend repeats that value so the headline is readable without hovering.
 * The chart options themselves are built (and tested) in growth-options.ts.
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

  const { options, series, ends } = buildGrowthOptions({
    categories: categories?.length ? categories : FALLBACK_CATEGORIES,
    teachers,
    students,
    ink,
  });

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
              color: GROWTH_COLORS[0],
              value: formatNumber(ends[0]),
              hint: deltaHint(teacherDelta),
            },
            {
              name: "Students",
              color: GROWTH_COLORS[1],
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
