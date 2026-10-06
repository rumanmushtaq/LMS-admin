import React from "react";
import { Box } from "../styles/box";

/** A single pulsing placeholder bar. */
const Bar = ({ w = "80%" }: { w?: string | number }) => (
  <Box
    css={{
      height: "14px",
      width: w,
      borderRadius: "7px",
      background:
        "linear-gradient(90deg, $accents1 25%, $accents2 37%, $accents1 63%)",
      backgroundSize: "400% 100%",
      animation: "tblSkeletonShimmer 1.4s ease infinite",
      "@keyframes tblSkeletonShimmer": {
        "0%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
    }}
  />
);

interface Props {
  /** Column count to mirror the real table's width. */
  cols?: number;
  /** How many placeholder rows to render. */
  rows?: number;
}

/**
 * Loading placeholder for a data table: a header strip plus shimmer rows,
 * sized to the real table so the layout doesn't jump when data arrives.
 */
export const TableSkeleton = ({ cols = 5, rows = 6 }: Props) => {
  const grid = `repeat(${cols}, 1fr)`;
  return (
    <Box
      css={{
        borderRadius: "24px",
        border: "1px solid $border",
        bg: "$sidebarBg",
        p: "$8",
        boxShadow: "$sm",
        overflow: "hidden",
      }}
    >
      <Box
        css={{
          display: "grid",
          gridTemplateColumns: grid,
          gap: "$8",
          pb: "$6",
          mb: "$2",
          borderBottom: "1px solid $border",
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Bar key={`h-${i}`} w="55%" />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, r) => (
        <Box
          key={`r-${r}`}
          css={{
            display: "grid",
            gridTemplateColumns: grid,
            gap: "$8",
            py: "$8",
            alignItems: "center",
          }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Bar key={`c-${r}-${c}`} w={c === 0 ? "70%" : "88%"} />
          ))}
        </Box>
      ))}
    </Box>
  );
};
