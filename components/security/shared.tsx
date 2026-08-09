import { styled, Tooltip } from "@nextui-org/react";
import React from "react";
import type { IpRisk } from "../../services/security";

/**
 * Times are shown relative ("2m ago") for scanability, with the absolute
 * value one hover away — an admin triaging an attack cares about recency,
 * an admin writing an incident report cares about the exact timestamp.
 */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return "now";
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function localTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

/** Countdown for temporary blocks, e.g. "expires in 42m". */
export function expiresIn(iso: string | null): string {
  if (!iso) return "permanent";
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return "expiring…";
  const minutes = Math.ceil(diffMs / 60000);
  if (minutes < 60) return `expires in ${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `expires in ${hours}h`;
  return `expires in ${Math.round(hours / 24)}d`;
}

export const Pill = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
  variants: {
    tone: {
      green: { background: "rgba(23, 201, 100, 0.15)", color: "#17c964" },
      yellow: { background: "rgba(245, 165, 36, 0.15)", color: "#f5a524" },
      red: { background: "rgba(243, 18, 96, 0.15)", color: "#f31260" },
      gray: { background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" },
      blue: { background: "rgba(0, 111, 238, 0.15)", color: "#3694ff" },
      purple: { background: "rgba(112, 71, 235, 0.15)", color: "#9d7aff" },
    },
  },
  defaultVariants: { tone: "gray" },
});

const RISK_TONE = { low: "green", medium: "yellow", high: "red" } as const;

/**
 * The badge never stands alone: the tooltip carries *why* the score is what
 * it is. An unexplained risk score trains admins to ignore it.
 */
export const RiskBadge = ({ risk }: { risk: IpRisk }) => {
  const label = risk.level.charAt(0).toUpperCase() + risk.level.slice(1);
  if (risk.reasons.length === 0) {
    return <Pill tone={RISK_TONE[risk.level]}>{label}</Pill>;
  }
  return (
    <Tooltip content={risk.reasons.join(" · ")} rounded>
      <Pill tone={RISK_TONE[risk.level]} css={{ cursor: "help" }}>
        {label}
      </Pill>
    </Tooltip>
  );
};

export const Mono = styled("span", {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "13px",
});
