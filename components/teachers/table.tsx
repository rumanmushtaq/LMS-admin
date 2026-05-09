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
import { TeacherVerificationModal } from "./verification-modal";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [emailVerified, setEmailVerified] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch teachers with pagination and filters
  const fetchTeachers = useCallback(
    async (
      page = 1,
      search = "",
      statusFilter = "all",
      start = "",
      end = "",
      verified = "all",
      sortField = "createdAt",
      sortOrder = "desc",
    ) => {
      try {
        setLoading(true);
        // Using getTutors
        const response = await adminService.getTutors({
          page,
          limit: 10,
          search,
          status: statusFilter === "all" ? undefined : statusFilter,
          startDate: start || undefined,
          endDate: end || undefined,
          emailVerified: verified === "all" ? undefined : verified === "true",
          sortBy: sortField,
          sortOrder: sortOrder as "asc" | "desc",
        });

        console.log("Teachers API Response:", response);

        // API returns { success: true, data: { data: [], meta: {} } }
        if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          setTeachers(response.data.data);
          setMeta(
            response.data.meta || {
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 0,
            },
          );
        } else if (response && response.data && Array.isArray(response.data)) {
          // Fallback if it's already the inner data object
          setTeachers(response.data);
          setMeta(
            response.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
          );
        } else if (Array.isArray(response)) {
          setTeachers(response);
        } else {
          console.warn("Unexpected response format from tutors API:", response);
          setTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchTeachers(
      1,
      searchTerm,
      status,
      startDate,
      endDate,
      emailVerified,
      sortBy,
      sortOrder,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchTeachers,
    searchTerm,
    status,
    startDate,
    endDate,
    emailVerified,
    sortBy,
    sortOrder,
  ]);

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
      fetchTeachers(
        1,
        "",
        status,
        startDate,
        endDate,
        emailVerified,
        sortBy,
        sortOrder,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    debouncedSearch,
    fetchTeachers,
    status,
    startDate,
    endDate,
    emailVerified,
    sortBy,
    sortOrder,
  ]);

  // Effect for filters
  useEffect(() => {
    fetchTeachers(
      1,
      searchTerm,
      status,
      startDate,
      endDate,
      emailVerified,
      sortBy,
      sortOrder,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    searchTerm,
    fetchTeachers,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    emailVerified,
  ]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchTeachers(
      page,
      searchTerm,
      status,
      startDate,
      endDate,
      emailVerified,
      sortBy,
      sortOrder,
    );
  };

  // Handle refresh after actions
  const handleRefresh = () => {
    fetchTeachers(
      meta.page,
      searchTerm,
      status,
      startDate,
      endDate,
      emailVerified,
      sortBy,
      sortOrder,
    );
  };

  const handleVerify = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this teacher?")) return;
    try {
      await adminService.approveTutor(id);
      setIsModalOpen(false);
      handleRefresh();
      alert("Teacher approved successfully!");
    } catch (error) {
      console.error("Approve error", error);
      alert("Failed to approve teacher.");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Please enter rejection reason (optional):");
    if (reason === null) return;
    try {
      await adminService.rejectTutor(id, reason);
      setIsModalOpen(false);
      handleRefresh();
      alert("Teacher application rejected.");
    } catch (error) {
      console.error("Reject error", error);
      alert("Failed to reject teacher.");
    }
  };

  return (
    <Box
      css={{
        "& .nextui-table-container": {
          boxShadow: "$md",
          borderRadius: "24px",
          border: "1px solid $border",
          bg: "$sidebarBg",
          padding: "$4",
        },
        "& .nextui-table": {
          minWidth: "100%",
        },
        "& .nextui-table-header": {
          bg: "$accents1",
          borderRadius: "16px",
        },
        "& .nextui-table-checkbox-container .nextui-checkbox-mask": {
          borderColor: "$primary",
        },
        "& .nextui-table-row:hover": {
          bg: "rgba(112, 71, 235, 0.05) !important",
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
        emailVerified={emailVerified}
        onEmailVerifiedChange={(key) => setEmailVerified(key as string)}
        addButton={addButton}
        onExport={() => console.log("Exporting...")}
      />

      {loading ? (
        <Row justify="center" align="center" css={{ height: "400px" }}>
          <Spinner size="lg" color="primary" />
        </Row>
      ) : (
        <>
          <Table
            aria-label="Teachers table"
            css={{
              height: "auto",
              minWidth: "100%",
              width: "100%",
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
                  <Text
                    b
                    size={13}
                    color="$accents8"
                    css={{ tt: "uppercase", letterSpacing: "$wider" }}
                  >
                    {column.name}
                  </Text>
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={teachers}>
              {(item: any) => (
                <Table.Row key={item._id}>
                  {(columnKey: any) => (
                    <Table.Cell>
                      {RenderCell({
                        teacher: item,
                        columnKey: columnKey,
                        onRefresh: handleRefresh,
                        onVerify: () => handleVerify(item),
                        router: router,
                      })}
                    </Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <Flex justify="center" css={{ mt: "$12", pb: "$10" }}>
            <Pagination
              color="primary"
              shadow
              noMargin
              total={meta.totalPages}
              initialPage={meta.page}
              page={meta.page}
              onChange={handlePageChange}
              css={{
                "& .nextui-pagination-highlight": {
                  bg: "$primary",
                  boxShadow: "0 4px 14px 0 rgba(112, 71, 235, 0.39)",
                },
              }}
            />
          </Flex>
        </>
      )}
      <TeacherVerificationModal
        user={selectedTeacher}
        onVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Box>
  );
};
