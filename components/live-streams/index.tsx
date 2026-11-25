import { Text } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { Flex } from "../styles/flex";
import { ErrorBoundary } from "../common/error-boundary";
import { LiveStreamsTable } from "./table";

export const LiveStreams = () => {
  return (
    <Flex
      css={{
        mt: "$5",
        px: "$6",
        "@sm": {
          mt: "$10",
          px: "$16",
        },
      }}
      justify={"center"}
      direction={"column"}
    >
      <Flex justify="between" align="center" wrap="wrap" css={{ width: "100%", mb: "$5" }}>
        <Text h3 css={{ margin: 0 }}>Teacher Live Streams</Text>
        <Breadcrumbs>
          <Crumb>
            <HouseIcon />
            <Link href={"/"} legacyBehavior>
              <CrumbLink href="#">Home</CrumbLink>
            </Link>
            <Text>/</Text>
          </Crumb>
          <Crumb>
            <CrumbLink href="#">Live Streams</CrumbLink>
          </Crumb>
        </Breadcrumbs>
      </Flex>
      <ErrorBoundary>
        <LiveStreamsTable />
      </ErrorBoundary>
    </Flex>
  );
};
