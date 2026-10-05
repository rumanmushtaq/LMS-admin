import { Table, Loading, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import adminService from "../../services/admin";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import { columns, RowUser } from "./data";
import { RenderCell } from "./render-cell";
import { extractUsers, routeForRole, toRow } from "./user-row";

interface TableWrapperProps {
  /** How many users to load (most recent first). */
  limit?: number;
  /** Rows shown per page in the client-side pager. */
  rowsPerPage?: number;
}

export const TableWrapper = ({
  limit = 50,
  rowsPerPage = 8,
}: TableWrapperProps) => {
  const router = useRouter();
  const [users, setUsers] = useState<RowUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page: 1,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setUsers(extractUsers(res).map(toRow));
    } catch (error) {
      console.error("Failed to load users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  const onView = (user: RowUser) => router.push(routeForRole(user.role));
  const onEdit = (user: RowUser) => router.push(routeForRole(user.role));
  const onDelete = async (user: RowUser) => {
    if (!user.id) return;
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" css={{ height: "320px" }}>
        <Loading size="lg" />
      </Flex>
    );
  }

  if (users.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        css={{ height: "260px", gap: "$3" }}
      >
        <Text b size={16} css={{ m: 0 }}>
          No users yet
        </Text>
        <Text size={14} css={{ m: 0, color: "$accents7" }}>
          New accounts will appear here as people sign up.
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      css={{
        "& .nextui-table-container": { boxShadow: "none" },
        "& .nextui-table-cell": { py: "$6" },
      }}
    >
      <Table
        aria-label="Users table"
        css={{
          height: "auto",
          minWidth: "100%",
          boxShadow: "none",
          width: "100%",
          px: 0,
        }}
        selectionMode="multiple"
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
        <Table.Body items={users}>
          {(item: RowUser) => (
            <Table.Row key={item.id}>
              {(columnKey: any) => (
                <Table.Cell>
                  {RenderCell({
                    user: item,
                    columnKey,
                    onView,
                    onEdit,
                    onDelete,
                  })}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          shadow
          noMargin
          align="center"
          rowsPerPage={rowsPerPage}
        />
      </Table>
    </Box>
  );
};
