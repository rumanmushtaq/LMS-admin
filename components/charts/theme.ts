import type { Props } from "react-apexcharts";

/**
 * One chart system for the whole admin panel.
 *
 * Every chart pulls its colours, ink and base options from here so the growth
 * chart on the dashboard and the traffic chart on the security page read as
 * the same product rather than two libraries' defaults.
 */

/**
 * Categorical slots, in fixed order. Validated with the dataviz palette
 * validator against both surfaces (light #ffffff, dark #16181d): lightness
 * band, chroma floor, CVD separation, normal-vision floor and 3:1 contrast
 * all pass. Never cycle past these; fold extra series into "Other".
 */
export const SERIES = {
  purple: "#6D4AE8",
  teal: "#0EA5A4",
  amber: "#C98500",
  red: "#D03B3B",
} as const;

export interface ChartInk {
  /** The card the chart sits on — used for marker rings and tooltip bg. */
  surface: string;
  /** Horizontal hairlines. */
  grid: string;
  /** Baseline / crosshair. */
  axis: string;
  /** Axis tick labels. */
  muted: string;
  /** Legend names, subtitles. */
  secondary: string;
  /** Values, titles. */
  primary: string;
}

/**
 * ApexCharts writes most colours as SVG attributes, where CSS variables do
 * not resolve, so the ink is picked per theme as plain hex. The values mirror
 * NextUI's light/dark `accents` scale so the chart matches its card.
 */
export const inkFor = (isDark: boolean): ChartInk =>
  isDark
    ? {
        surface: "#16181A",
        grid: "#26292B",
        axis: "#313538",
        muted: "#787F85",
        secondary: "#889096",
        primary: "#ECEDEE",
      }
    : {
        surface: "#FFFFFF",
        grid: "#ECEEF0",
        axis: "#DFE3E6",
        muted: "#889096",
        secondary: "#697177",
        primary: "#11181C",
      };

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

export const formatNumber = (value: number): string =>
  Math.round(value).toLocaleString();

/** Series and category names come from the API — never trust them as HTML. */
const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

/**
 * One tooltip, every series at the hovered X. The value leads and the series
 * name follows — the reader already knows which line they are on and wants
 * the number — keyed by a short stroke of the series colour.
 */
export const buildTooltip =
  (
    ink: ChartInk,
    formatValue: (value: number, seriesIndex: number) => string = (v) =>
      formatNumber(v),
  ) =>
  ({ series, dataPointIndex, w }: any): string => {
    const label =
      w.globals.categoryLabels?.[dataPointIndex] ??
      w.globals.labels?.[dataPointIndex] ??
      "";

    const rows = (series as number[][])
      .map((values, i) => {
        const value = values?.[dataPointIndex];
        if (value == null) return "";
        return (
          `<div class="vz-tip-row">` +
          `<span class="vz-tip-key" style="background:${w.globals.colors[i]}"></span>` +
          `<span class="vz-tip-val">${escapeHtml(formatValue(value, i))}</span>` +
          `<span class="vz-tip-name">${escapeHtml(w.globals.seriesNames[i])}</span>` +
          `</div>`
        );
      })
      .join("");

    return (
      `<div class="vz-tip" style="--vz-surface:${ink.surface};--vz-border:${ink.grid};` +
      `--vz-primary:${ink.primary};--vz-muted:${ink.muted}">` +
      `<div class="vz-tip-title">${escapeHtml(label)}</div>${rows}</div>`
    );
  };

/**
 * Base options for a smooth area/line chart: thin 2px lines, a faint wash,
 * solid hairline gridlines, no vertical grid, no toolbar, no drop shadows.
 * Charts spread this and add series-specific bits (categories, annotations).
 */
export const baseOptions = (
  id: string,
  ink: ChartInk,
  colors: string[],
): Props["options"] => ({
  chart: {
    id,
    type: "area",
    fontFamily: FONT,
    foreColor: ink.muted,
    background: "transparent",
    toolbar: { show: false },
    zoom: { enabled: false },
    parentHeightOffset: 0,
    animations: {
      enabled: true,
      speed: 450,
      animateGradually: { enabled: false },
      dynamicAnimation: { enabled: true, speed: 300 },
    },
  },
  colors,
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2, lineCap: "round" },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0,
      opacityFrom: 0.16,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  markers: {
    size: 0,
    strokeWidth: 2,
    strokeColors: ink.surface,
    hover: { size: 5, sizeOffset: 0 },
  },
  grid: {
    show: true,
    borderColor: ink.grid,
    strokeDashArray: 0,
    position: "back",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 8, right: 16, bottom: 0, left: 8 },
  },
  xaxis: {
    axisBorder: { show: true, color: ink.axis },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    crosshairs: {
      show: true,
      stroke: { color: ink.axis, width: 1, dashArray: 0 },
    },
    labels: {
      rotate: 0,
      hideOverlappingLabels: true,
      style: { colors: ink.muted, fontSize: "12px", fontFamily: FONT },
    },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    tickAmount: 4,
    labels: {
      formatter: (v: number) => formatNumber(v),
      style: { colors: ink.muted, fontSize: "12px", fontFamily: FONT },
    },
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    followCursor: false,
    custom: buildTooltip(ink),
  },
  states: {
    hover: { filter: { type: "none" } },
    active: { filter: { type: "none" } },
  },
});
