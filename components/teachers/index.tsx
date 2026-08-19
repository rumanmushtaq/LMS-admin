import { Button, Input, Text } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { ExportIcon } from "../icons/accounts/export-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { Flex } from "../styles/flex";
import { TableWrapper } from "./table";
import { AddTeacher } from "./add-teacher";

export const Teachers = () => {
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
        <Text h3 css={{ margin: 0 }}>All Teachers</Text>
        <Breadcrumbs>
          <Crumb>
            <HouseIcon />
            <Link href={"/"} legacyBehavior>
              <CrumbLink href="#">Home</CrumbLink>
            </Link>
            <Text>/</Text>
          </Crumb>

          <Crumb>
            <UsersIcon />
            <CrumbLink href="#">Teachers</CrumbLink>
            <Text>/</Text>
          </Crumb>
          <Crumb>
            <CrumbLink href="#">List</CrumbLink>
          </Crumb>
        </Breadcrumbs>
      </Flex>
      <TableWrapper addButton={<AddTeacher />} />
    </Flex>
  );
};
