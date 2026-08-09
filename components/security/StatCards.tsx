import { Text } from "@nextui-org/react";
import React from "react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import type { SecurityStats } from "../../services/security";
import { Pill } from "./shared";

const Card = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) => (
  <Box
    css={{
      flex: "1 1 160px",
      background: "var(--nextui-colors-accents0)",
      border: "1px solid var(--nextui-colors-border)",
      borderRadius: "$lg",
      p: "$8",
      minWidth: "160px",
    }}
  >
    <Text size={13} css={{ color: "$accents8", m: 0 }}>
      {label}
    </Text>
    <Text h3 css={{ m: 0, mt: "$2" }}>
      {value}
    </Text>
    {hint ? (
      <Text size={12} css={{ color: "$accents7", m: 0 }}>
        {hint}
      </Text>
    ) : null}
  </Box>
);

export const StatCards = ({ stats }: { stats: SecurityStats | null }) => {
  if (!stats) return null;
  return (
    <Flex direction="column" css={{ gap: "$6", mb: "$8" }}>
      {!stats.enforced && (
        <Box
          css={{
            background: "rgba(245, 165, 36, 0.1)",
            border: "1px solid rgba(245, 165, 36, 0.4)",
            borderRadius: "$md",
            p: "$6",
          }}
        >
          <Text size={14} css={{ m: 0 }}>
            <b>Shadow mode.</b> Blocks are being computed and counted below,
            but no traffic is refused yet. Review the “Blocked attempts”
            counters for false positives, then set{" "}
            <Text as="span" size={13} css={{ fontFamily: "monospace" }}>
              SECURITY_ENFORCE=true
            </Text>{" "}
            on the API to enforce.
          </Text>
        </Box>
      )}
      <Flex wrap="wrap" css={{ gap: "$6" }}>
        <Card
          label="Unique IPs (24h)"
          value={stats.uniqueIps.toLocaleString()}
        />
        <Card
          label="Active blocks"
          value={stats.activeBlocks.toLocaleString()}
          hint={stats.enforced ? "enforced" : "shadow — not enforced"}
        />
        <Card
          label="Auto-blocks (24h)"
          value={stats.autoBlocks.toLocaleString()}
          hint="system-initiated"
        />
        <Card
          label="Failed logins (24h)"
          value={
            <Flex align="center" css={{ gap: "$4" }}>
              {stats.failedLogins.toLocaleString()}
              {stats.failedLogins > 200 ? <Pill tone="red">high</Pill> : null}
            </Flex>
          }
        />
        <Card
          label="Blocked attempts (24h)"
          value={stats.blocked.toLocaleString()}
          hint={stats.enforced ? "requests refused" : "would be refused"}
        />
      </Flex>
    </Flex>
  );
};
