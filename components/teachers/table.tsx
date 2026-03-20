import {
  Table,
  Text,
  Row,
  Col,
  Input,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import React, { useEffect, useState, useCallback } from "react";
import { Box } from "../styles/box";
import { columns, statusOptions } from "./data";
import { RenderCell } from "./render-cell";
import adminService from "../../services/admin";
import { TableFilters } from "../table/filters";
import { Flex } from "../styles/flex";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  emailVerified: boolean;
  subject?: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Props {
  addButton?: React.ReactNode;
}

export const TableWrapper = ({ addButton }: Props) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch teachers with pagination and filters
  const fetchTeachers = useCallback(
    async (
      page = 1,
      search = "",
      statusFilter = "all",
      sortField = "createdAt",
      sortOrder = "desc",
    ) => {
      try {
        setLoading(true);
        // Using getUsers with role=teacher
        const response = await adminService.getUsers({
          page,
          limit: 10,
          search,
          role: "teacher",
          status: statusFilter === "all" ? undefined : statusFilter,
          sortBy: sortField,
          sortOrder: sortOrder as "asc" | "desc",
        });

        setTeachers(response.data || []);
        setMeta(
          response.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
        );
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchTeachers(1, searchTerm, status, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTeachers, searchTerm, status, sortBy, sortOrder]);

  // Debounced search
  const debouncedSearch = useCallback(
    (term: string) => {
      fetchTeachers(1, term, status, sortBy, sortOrder);
    },
    [fetchTeachers, status, sortBy, sortOrder],
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      fetchTeachers(1, "", status, sortBy, sortOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debouncedSearch, fetchTeachers, status, sortBy, sortOrder]);

  // Effect for filters
  useEffect(() => {
    fetchTeachers(1, searchTerm, status, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, searchTerm, fetchTeachers, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchTeachers(page, searchTerm, status, sortBy, sortOrder);
  };

  // Handle refresh after actions
  const handleRefresh = () => {
    fetchTeachers(meta.page, searchTerm, status, sortBy, sortOrder);
  };

  return (
    <Box
      css={{
        "& .nextui-table-container": {
          boxShadow: "none",
        },
      }}
    >
      <TableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={(key) => setStatus(key as string)}
        statusOptions={statusOptions}
        addButton={addButton}
        onExport={() => console.log("Exporting...")}
      />

      {loading ? (
        <Row justify="center" align="center" css={{ height: "400px" }}>
          <Spinner size="lg" />
        </Row>
      ) : (
        <>
          <Table
            aria-label="Teachers table"
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
                  allowsSorting={column.uid !== "actions"}
                >
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={teachers}>
              {(item: any) => (
                <Table.Row key={item._id}>
                  {(columnKey) => (
                    <Table.Cell>
                      {RenderCell({
                        teacher: item,
                        columnKey: columnKey,
                        onRefresh: handleRefresh,
                      })}
                    </Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <Flex justify="center" css={{ mt: "$10" }}>
            <Pagination
              shadow
              noMargin
              total={meta.totalPages}
              initialPage={meta.page}
              onChange={handlePageChange}
            />
          </Flex>
        </>
      )}
    </Box>
  );
};
