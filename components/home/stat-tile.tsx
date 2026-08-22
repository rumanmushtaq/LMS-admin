import React from "react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";

export type TileAccent = "purple" | "teal" | "amber";

const ACCENT: Record<TileAccent, { fg: string; bg: string }> = {
  purple: { fg: "#6D4AE8", bg: "rgba(109, 74, 232, 0.12)" },
  teal: { fg: "#0EA5A4", bg: "rgba(14, 165, 164, 0.12)" },
  amber: { fg: "#C98500", bg: "rgba(201, 133, 0, 0.14)" },
};

const HINT_DOT = {
  good: "#0CA30C",
  warning: "#FAB219",
  neutral: "var(--nextui-colors-accents5)",
} as const;

export interface StatTileProps {
  label: string;
  /** Small line under the label, e.g. "Registered" or "This week". */
  caption?: string;
  value: number;
  /** Signed change vs a named period; renders a pill beside the value. */
  delta?: { value: number; period: string };
  /** Footer line with a status dot. */
  hint?: { text: string; tone?: keyof typeof HINT_DOT };
  accent: TileAccent;
  icon: React.ReactNode;
}

/**
 * A number with its context. The value is the hero; everything else is quiet
 * ink around it. Colour is limited to the icon tint and the delta pill so the
 * three tiles read as one row rather than three billboards.
 */
export const StatTile = ({
  label,
  caption,
  value,
  delta,
  hint,
  accent,
  icon,
}: StatTileProps) => {
  const tint = ACCENT[accent];

  return (
    <Box
      css={{
        flex: "1 1 240px",
        minWidth: 0,
        background: "$backgroundContrast",
        border: "1px solid $border",
        borderRadius: "16px",
        p: "$9",
        boxShadow: "0 1px 2px rgba(17, 24, 28, 0.04)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 30px -18px rgba(17, 24, 28, 0.35)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
        },
      }}
    >
      <Flex justify="between" align="start" css={{ gap: "$6" }}>
        <Box css={{ minWidth: 0 }}>
          <Box
            as="span"
            css={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "$accents8",
              letterSpacing: "0.01em",
            }}
          >
            {label}
          </Box>
          {caption ? (
            <Box
              as="span"
              css={{ display: "block", mt: "2px", fontSize: "12px", color: "$accents6" }}
            >
              {caption}
            </Box>
          ) : null}
        </Box>
        <Box
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: tint.bg,
            color: tint.fg,
            "& svg": { color: tint.fg },
          }}
        >
          {icon}
        </Box>
      </Flex>

      <Flex align="end" wrap="wrap" css={{ gap: "$5", mt: "$8" }}>
        <Box
          as="span"
          css={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "$text",
          }}
        >
          {value.toLocaleString()}
        </Box>
        {delta ? <DeltaPill value={delta.value} period={delta.period} /> : null}
      </Flex>

      {hint ? (
        <Flex align="center" css={{ gap: "$4", mt: "$6" }}>
          <Box
            css={{
              width: "7px",
              height: "7px",
              borderRadius: "$pill",
              flex: "none",
              background: HINT_DOT[hint.tone ?? "neutral"],
            }}
          />
          <Box as="span" css={{ fontSize: "12.5px", color: "$accents7" }}>
            {hint.text}
          </Box>
        </Flex>
      ) : null}
    </Box>
  );
};

/** "↑ 3 this month" — green when growing, neutral when flat, red when falling. */
const DeltaPill = ({ value, period }: { value: number; period: string }) => {
  const up = value > 0;
  const down = value < 0;
  const colors = up
    ? { bg: "rgba(12, 163, 12, 0.12)", fg: "#0A7A0A" }
    : down
    ? { bg: "rgba(208, 59, 59, 0.12)", fg: "#B32E2E" }
    : { bg: "var(--nextui-colors-accents1)", fg: "var(--nextui-colors-accents7)" };

  return (
    <Box
      as="span"
      css={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        whiteSpace: "nowrap",
        px: "$4",
        py: "3px",
        mb: "3px",
        borderRadius: "$pill",
        background: colors.bg,
        color: colors.fg,
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {up ? "↑" : down ? "↓" : "—"}{" "}
      {value === 0 ? "No change" : Math.abs(value).toLocaleString()}
      <Box as="span" css={{ fontWeight: 500, opacity: 0.8 }}>
        {period}
      </Box>
    </Box>
  );
};
