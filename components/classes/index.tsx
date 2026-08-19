import { Text } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { Flex } from "../styles/flex";
import { TableWrapper } from "./table";

export const Classes = () => {
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
        <Text h3 css={{ margin: 0 }}>All Classes</Text>
        <Breadcrumbs>
          <Crumb>
            <HouseIcon />
            <Link href={"/"} legacyBehavior>
              <CrumbLink href="#">Home</CrumbLink>
            </Link>
            <Text>/</Text>
          </Crumb>

          <Crumb>
            <ProductsIcon />
            <CrumbLink href="#">Classes</CrumbLink>
            <Text>/</Text>
          </Crumb>
          <Crumb>
            <CrumbLink href="#">List</CrumbLink>
          </Crumb>
        </Breadcrumbs>
      </Flex>
      <TableWrapper />
    </Flex>
  );
};
