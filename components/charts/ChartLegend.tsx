import React from "react";
import type { ChartInk } from "./theme";

export interface LegendItem {
  name: string;
  color: string;
  /** Latest value, shown bold beside the name. */
  value?: string;
  /** Small trailing note, e.g. "+3 this month". */
  hint?: string;
}

/**
 * Legend for line/area charts: a short stroke of the series colour (the mark
 * it mirrors), the name in secondary ink and — when supplied — the latest
 * value in primary ink. Text never wears the series colour.
 */
export const ChartLegend = ({
  items,
  ink,
}: {
  items: LegendItem[];
  ink: ChartInk;
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "8px 20px",
    }}
  >
    {items.map((item) => (
      <div
        key={item.name}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 14,
            height: 2,
            borderRadius: 2,
            background: item.color,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, color: ink.secondary }}>
          {item.name}
        </span>
        {item.value ? (
          <span style={{ fontSize: 13, fontWeight: 600, color: ink.primary }}>
            {item.value}
          </span>
        ) : null}
        {item.hint ? (
          <span style={{ fontSize: 12, color: ink.muted }}>{item.hint}</span>
        ) : null}
      </div>
    ))}
  </div>
);
