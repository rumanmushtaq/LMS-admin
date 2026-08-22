import React from "react";
import { Box } from "../styles/box";
import Chart, { Props } from "react-apexcharts";

export interface SteamProps {
  categories?: string[];
  teachers?: number[];
  students?: number[];
}

// Brand palette: Teachers echo the blue teacher card, Students the emerald
// transactions card — so the legend reads without a second glance.
const TEACHER_COLOR = "#0072F5";
const STUDENT_COLOR = "#17C964";

const FALLBACK_CATEGORIES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const buildOptions = (categories: string[]): Props["options"] => ({
  chart: {
    type: "area",
    animations: { enabled: true, speed: 500, easing: "easeinout" },
    sparkline: { enabled: false },
    brush: { enabled: false },
    id: "growth-chart",
    fontFamily: "Inter, sans-serif",
    foreColor: "var(--nextui-colors-accents8)",
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
    dropShadow: {
      enabled: true,
      top: 6,
      left: 0,
      blur: 8,
      opacity: 0.12,
      color: TEACHER_COLOR,
    },
  },
  colors: [TEACHER_COLOR, STUDENT_COLOR],
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 3,
    lineCap: "round",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.02,
      stops: [0, 95, 100],
    },
  },
  markers: {
    size: 0,
    strokeWidth: 2,
    strokeColors: "#fff",
    hover: { size: 6 },
  },
  xaxis: {
    categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      rotate: 0,
      hideOverlappingLabels: true,
      style: {
        colors: "var(--nextui-colors-accents7)",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
      },
    },
    tooltip: { enabled: false },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    labels: {
      formatter: (v: number) => `${Math.round(v)}`,
      style: {
        colors: "var(--nextui-colors-accents7)",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
      },
    },
  },
  grid: {
    show: true,
    borderColor: "var(--nextui-colors-border)",
    strokeDashArray: 4,
    position: "back",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 8, bottom: 0, left: 8 },
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    markers: {
      // @ts-ignore — width/height/radius are valid ApexCharts legend markers
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: { horizontal: 12, vertical: 4 },
    labels: { colors: "var(--nextui-colors-accents9)" },
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    theme: "light",
    style: { fontFamily: "Inter, sans-serif" },
    y: { formatter: (v: number) => `${Math.round(v)} total` },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: { height: 300 },
        legend: { fontSize: "12px" },
      },
    },
  ],
});

export const Steam = ({ categories, teachers, students }: SteamProps) => {
  const cats = categories?.length ? categories : FALLBACK_CATEGORIES;
  const series: Props["series"] = [
    {
      name: "Teachers",
      data: teachers?.length ? teachers : new Array(cats.length).fill(0),
    },
    {
      name: "Students",
      data: students?.length ? students : new Array(cats.length).fill(0),
    },
  ];

  return (
    <Box css={{ width: "100%", zIndex: 5 }}>
      <div id="chart">
        <Chart
          options={buildOptions(cats)}
          series={series}
          type="area"
          height={425}
        />
      </div>
    </Box>
  );
};
