import { Text } from "@nextui-org/react";
import React from "react";
import { Flex } from "../styles/flex";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <Flex direction={"column"} css={{ gap: "$4" }}>
      <Text
        span
        size={"$xs"}
        weight={"normal"}
        css={{
          color: "$sidebarText",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <Flex direction={"column"} css={{ gap: "$2" }}>
        {children}
      </Flex>
    </Flex>
  );
};
