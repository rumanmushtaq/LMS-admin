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

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  emailVerified: boolean;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch students with pagination and filters
  const fetchStudents = useCallback(
    async (
      page = 1,
      search = "",
      statusFilter = "all",
      start = "",
      end = "",
      sortField = "createdAt",
      sortOrder = "desc",
    ) => {
      try {
        setLoading(true);
        const response = await adminService.getStudents({
          page,
          limit: 10,
          search,
          status: statusFilter === "all" ? undefined : statusFilter,
          startDate: start || undefined,
          endDate: end || undefined,
          sortBy: sortField,
          sortOrder: sortOrder as "asc" | "desc",
        });

        setStudents(response.data.data || []);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchStudents(1, searchTerm, status, startDate, endDate, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStudents, searchTerm, status, startDate, endDate, sortBy, sortOrder]);

  // Debounced search
  const debouncedSearch = useCallback(
    (term: string) => {
      fetchStudents(1, term, status, startDate, endDate, sortBy, sortOrder);
    },
    [fetchStudents, status, startDate, endDate, sortBy, sortOrder],
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      fetchStudents(1, "", status, startDate, endDate, sortBy, sortOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debouncedSearch, fetchStudents, status, startDate, endDate, sortBy, sortOrder]);

  // Effect for filters
  useEffect(() => {
    fetchStudents(1, searchTerm, status, startDate, endDate, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, startDate, endDate, searchTerm, fetchStudents, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchStudents(
      page,
      searchTerm,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    );
  };

  // Handle refresh after actions
  const handleRefresh = () => {
    fetchStudents(
      meta.page,
      searchTerm,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    );
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
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
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
            aria-label="Students table"
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
            <Table.Body items={students}>
              {(item) => (
                <Table.Row key={item._id}>
                  {(columnKey) => (
                    <Table.Cell>
                      {RenderCell({
                        student: item,
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
              color="secondary"
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
