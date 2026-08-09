import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { Box } from "../styles/box";
import type { TimeseriesPoint } from "../../services/security";

// ApexCharts touches `window` at import time; render client-side only.
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * One chart, two stories: total traffic and rejected traffic. The lines
 * diverging is the attack signal — that's the entire reason this exists on
 * the page rather than two separate sparklines.
 */
export const TrafficChart = ({ points }: { points: TimeseriesPoint[] }) => {
  const { series, categories } = useMemo(() => {
    return {
      series: [
        { name: "Requests", data: points.map((p) => p.requests) },
        { name: "Failed logins", data: points.map((p) => p.failedLogins) },
        { name: "Blocked", data: points.map((p) => p.blocked) },
      ],
      categories: points.map((p) =>
        new Date(p.hour).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
        }),
      ),
    };
  }, [points]);

  if (points.length === 0) return null;

  return (
    <Box
      css={{
        background: "var(--nextui-colors-accents0)",
        border: "1px solid var(--nextui-colors-border)",
        borderRadius: "$lg",
        p: "$6",
        mb: "$8",
      }}
    >
      <Chart
        type="area"
        height={220}
        series={series}
        options={{
          chart: {
            toolbar: { show: false },
            fontFamily: "Inter, sans-serif",
            foreColor: "var(--nextui-colors-accents9)",
            animations: { speed: 300 },
          },
          colors: ["#3694ff", "#f5a524", "#f31260"],
          stroke: { curve: "smooth", width: 2 },
          fill: {
            type: "gradient",
            gradient: { opacityFrom: 0.25, opacityTo: 0.02 },
          },
          dataLabels: { enabled: false },
          xaxis: {
            categories,
            tickAmount: 8,
            labels: {
              style: { colors: "var(--nextui-colors-accents8)" },
            },
            axisBorder: { color: "var(--nextui-colors-border)" },
            axisTicks: { color: "var(--nextui-colors-border)" },
          },
          yaxis: {
            labels: { style: { colors: "var(--nextui-colors-accents8)" } },
          },
          grid: { borderColor: "var(--nextui-colors-border)" },
          legend: { position: "top", horizontalAlign: "right" },
          tooltip: { theme: "dark", shared: true },
        }}
      />
    </Box>
  );
};
