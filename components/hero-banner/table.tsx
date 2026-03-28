import { Table } from "@nextui-org/react";
import React from "react";
import { RenderCell } from "./render-cell";
import { useQuery } from "@tanstack/react-query";
import AdminService from "../../services/admin";
import { Flex } from "../styles/flex";

const columns = [
  { name: "TITLE", uid: "title" },
  { name: "SUBTITLE", uid: "subtitle" },
  { name: "STUDENTS", uid: "studentCount" },
  { name: "RATING", uid: "rating" },
  { name: "ACTIONS", uid: "actions" },
];

interface TableWrapperProps {
  addButton?: React.ReactNode;
}

export const TableWrapper = ({ addButton }: TableWrapperProps) => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: () => AdminService.getHeroBanners(),
  });

  return (
    <Flex direction="column" css={{ width: "100%", gap: "$8" }}>
      <Flex justify="end">{addButton}</Flex>
      <Table
        aria-label="Hero Banners data table"
        css={{
          height: "auto",
          minWidth: "100%",
          boxShadow: "none",
          width: "100%",
          px: 0,
        }}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body
          items={banners?.data || []}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item: any) => (
            <Table.Row key={item._id}>
              {(columnKey) => (
                <Table.Cell>
                  {RenderCell({ user: item, columnKey: columnKey })}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          shadow
          noMargin
          align="center"
          rowsPerPage={10}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </Flex>
  );
};
