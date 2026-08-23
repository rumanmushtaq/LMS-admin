import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useTheme } from "@nextui-org/react";
import type { Props } from "react-apexcharts";
import type { TimeseriesPoint } from "../../services/security";
import { SERIES, inkFor, baseOptions, formatNumber } from "../charts/theme";
import { ChartCard } from "../charts/ChartCard";
import { ChartLegend } from "../charts/ChartLegend";
import { Box } from "../styles/box";
import { describeSpan } from "../../lib/charts/describe-span";

// ApexCharts touches `window` at import time; render client-side only.
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Requests is a plain series (slot 1); failed logins and blocks are the two
// "bad" series, so they take the warm slots — amber then red — which read as
// escalating severity without borrowing the status palette for a series.
const COLORS = [SERIES.purple, SERIES.amber, SERIES.red];

/**
 * One chart, three stories: total traffic, failed logins and blocked
 * requests. The lines diverging is the attack signal — that is the entire
 * reason this exists on the page rather than three separate sparklines.
 */
export const TrafficChart = ({ points }: { points: TimeseriesPoint[] }) => {
  const { isDark } = useTheme();
  const ink = inkFor(!!isDark);

  const { series, categories, totals } = useMemo(() => {
    const sum = (pick: (p: TimeseriesPoint) => number) =>
      points.reduce((acc, p) => acc + pick(p), 0);
    return {
      series: [
        { name: "Requests", data: points.map((p) => p.requests) },
        { name: "Failed logins", data: points.map((p) => p.failedLogins) },
        { name: "Blocked", data: points.map((p) => p.blocked) },
      ] as NonNullable<Props["series"]>,
      categories: points.map((p) =>
        new Date(p.hour).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
        }),
      ),
      totals: [
        sum((p) => p.requests),
        sum((p) => p.failedLogins),
        sum((p) => p.blocked),
      ],
    };
  }, [points]);

  if (points.length === 0) return null;

  const base = baseOptions("traffic-chart", ink, COLORS);
  const options: Props["options"] = {
    ...base,
    xaxis: { ...base?.xaxis, categories, tickAmount: 8 },
  };

  const span = describeSpan(points);

  return (
    <Box css={{ mb: "$8" }}>
      <ChartCard
        title="Traffic"
        subtitle={`Requests against failed logins and blocked attempts, last ${span}`}
        aside={
          <ChartLegend
            ink={ink}
            items={series.map((s, i) => ({
              name: String((s as { name?: string }).name ?? ""),
              color: COLORS[i],
              value: formatNumber(totals[i]),
            }))}
          />
        }
      >
        <Chart type="area" height={240} series={series} options={options} />
      </ChartCard>
    </Box>
  );
};
