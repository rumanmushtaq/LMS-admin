import { Text } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { Flex } from "../styles/flex";
import { TableWrapper } from "./table";
import { AddBanner } from "./add-banner";

export const HeroBanners = () => {
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
      <Breadcrumbs>
        <Crumb>
          <HouseIcon />
          <Link href={"/"} legacyBehavior>
            <CrumbLink href="#">Home</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>

        <Crumb>
          <CrumbLink href="#">Hero Banner</CrumbLink>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink href="#">List</CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Text h2 css={{ mb: "$0" }}>
        Hero Banner Management
      </Text>
      <Text span size="$base" css={{ color: "$accents8", mb: "$8" }}>
        Customize and manage the promotional sliders displayed on your homepage.
      </Text>

      <Flex
        direction={"column"}
        css={{
          width: "100%",
          bg: "$background",
          borderRadius: "16px",
          p: "$8",
          boxShadow: "$md",
          mt: "$4",
        }}
      >
        <TableWrapper addButton={<AddBanner />} />
      </Flex>
    </Flex>
  );
};
