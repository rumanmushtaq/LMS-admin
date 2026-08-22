import React from "react";
import { Text } from "@nextui-org/react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Right-hand slot in the header — usually the legend. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

/** The card every chart sits in: surface, hairline, title row, plot. */
export const ChartCard = ({ title, subtitle, aside, children }: ChartCardProps) => (
  <Box
    css={{
      width: "100%",
      background: "$backgroundContrast",
      border: "1px solid $border",
      borderRadius: "16px",
      px: "$10",
      pt: "$9",
      pb: "$6",
      boxShadow: "0 1px 2px rgba(17, 24, 28, 0.04)",
    }}
  >
    <Flex
      justify="between"
      align="start"
      wrap="wrap"
      css={{ gap: "$6", mb: "$4" }}
    >
      <Box css={{ minWidth: 0 }}>
        <Text
          css={{
            m: 0,
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "$text",
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text css={{ m: 0, mt: "2px", fontSize: "13px", color: "$accents7" }}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {aside}
    </Flex>
    {children}
  </Box>
);
