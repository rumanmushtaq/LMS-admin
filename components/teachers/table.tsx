import { Text, Pagination } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Box } from "../styles/box";
import { columns, statusOptions } from "./data";
import { RenderCell } from "./render-cell";
import adminService from "../../services/admin";
import { TableFilters } from "../table/filters";
import { TableSkeleton } from "../table/table-skeleton";
import { Flex } from "../styles/flex";
import { TeacherVerificationModal } from "./verification-modal";
import { useRouter } from "next/router";
import { setTeacherStatus, type TeacherPage } from "./actions-menu";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  emailVerified: boolean;
  /** Joined subject list from the API, for display. */
  subject?: string | null;
  /** The same subjects as a list. */
  subjects?: string[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Props {
  addButton?: React.ReactNode;
}

export const TableWrapper = ({ addButton }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [emailVerified, setEmailVerified] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Selection lives here, driven only by the checkboxes — never by a row click.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleOne = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Debounced search
  useEffect(() => {
    if (searchTerm === debouncedSearch) return;
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearch]);

  /** Wraps a filter setter so changing the filter also goes back to page 1. */
  const resetPage =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  // Fetch teachers with pagination and filters
  const { data, isPending, isFetching } = useQuery({
    queryKey: [
      "teachers",
      page,
      debouncedSearch,
      status,
      startDate,
      endDate,
      emailVerified,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<TeacherPage> => {
      const emptyMeta: Meta = { total: 0, page: 1, limit: 10, totalPages: 0 };
      try {
        // Using getTutors
        const response = await adminService.getTutors({
          page,
          limit: 10,
          search: debouncedSearch,
          status: status === "all" ? undefined : status,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          emailVerified:
            emailVerified === "all" ? undefined : emailVerified === "true",
          sortBy,
          sortOrder,
        });

        console.log("Teachers API Response:", response);

        // API returns { success: true, data: { data: [], meta: {} } }
        if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          return {
            teachers: response.data.data,
            meta: response.data.meta || emptyMeta,
          };
        } else if (response && response.data && Array.isArray(response.data)) {
          // Fallback if it's already the inner data object
          return { teachers: response.data, meta: response.meta || emptyMeta };
        } else if (Array.isArray(response)) {
          return { teachers: response, meta: emptyMeta };
        } else {
          console.warn("Unexpected response format from tutors API:", response);
          return { teachers: [], meta: emptyMeta };
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }
    },
    // Keep the current rows on screen while the next page/filter loads, so
    // only the very first load shows the skeleton.
    placeholderData: keepPreviousData,
  });

  const teachers: Teacher[] = data?.teachers ?? [];
  const meta: Meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  const loading = isPending;

  // Deleting the last row of a later page leaves it empty — step back once
  // the refreshed page count arrives.
  useEffect(() => {
    if (!isFetching && page > Math.max(1, meta.totalPages)) {
      setPage(Math.max(1, meta.totalPages));
    }
  }, [isFetching, page, meta.totalPages]);

  // Handle page change
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  // Handle refresh after actions — quietly in the background; the cached rows
  // stay on screen. Joins a refetch already started by the action itself.
  const handleRefresh = () => {
    queryClient.invalidateQueries(
      { queryKey: ["teachers"] },
      { cancelRefetch: false },
    );
  };

  /** Applies an approve/reject result to the cache, then refreshes quietly. */
  const onReviewed = (id: string, nextStatus: string) => {
    setIsModalOpen(false);
    setTeacherStatus(queryClient, id, nextStatus);
    handleRefresh();
    queryClient.invalidateQueries({ queryKey: ["teacher", id] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveTutor(id),
    onSuccess: (_res, id) => {
      onReviewed(id, "active");
      alert("Teacher approved successfully!");
    },
    onError: (error) => {
      console.error("Approve error", error);
      alert("Failed to approve teacher.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminService.rejectTutor(id, reason),
    onSuccess: (_res, { id }) => {
      onReviewed(id, "suspended");
      alert("Teacher application rejected.");
    },
    onError: (error) => {
      console.error("Reject error", error);
      alert("Failed to reject teacher.");
    },
  });

  const handleVerify = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    if (!confirm("Are you sure you want to approve this teacher?")) return;
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt("Please enter rejection reason (optional):");
    if (reason === null) return;
    rejectMutation.mutate({ id, reason });
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
        onStatusChange={(key) => resetPage(setStatus)(key as string)}
        statusOptions={statusOptions}
        startDate={startDate}
        onStartDateChange={resetPage(setStartDate)}
        endDate={endDate}
        onEndDateChange={resetPage(setEndDate)}
        emailVerified={emailVerified}
        onEmailVerifiedChange={(key) =>
          resetPage(setEmailVerified)(key as string)
        }
        addButton={addButton}
        onExport={() => console.log("Exporting...")}
      />

      {loading ? (
        <TableSkeleton cols={columns.length} rows={8} />
      ) : teachers.length === 0 && !isFetching ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          css={{ height: "320px", gap: "$4" }}
        >
          <Text b size={16} color="$accents7">
            No teachers found
          </Text>
          <Text size={13} color="$accents6">
            Try adjusting your search or filters.
          </Text>
        </Flex>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-[#f4f4f5] text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="w-10 p-3 text-left">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#7047EB]"
                      checked={
                        teachers.length > 0 &&
                        teachers.every((t) => selectedIds.has(t._id))
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? new Set(teachers.map((t) => t._id))
                            : new Set(),
                        )
                      }
                    />
                  </th>
                  {columns
                    .filter((c) => c.uid !== "actions")
                    .map((c) => (
                      <th key={c.uid} className="p-3 text-left">
                        {c.name}
                      </th>
                    ))}
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {teachers.map((item: any) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 transition hover:bg-[#7047EB]/5"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#7047EB]"
                        checked={selectedIds.has(item._id)}
                        onChange={() => toggleOne(item._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    {columns
                      .filter((c) => c.uid !== "actions")
                      .map((c) => (
                        <td key={c.uid} className="p-3 align-middle">
                          <RenderCell
                            teacher={item}
                            columnKey={c.uid}
                            onRefresh={handleRefresh}
                            onVerify={() => handleVerify(item)}
                            router={router}
                          />
                        </td>
                      ))}
                    <td className="p-3 text-center align-middle">
                      <RenderCell
                        teacher={item}
                        columnKey="actions"
                        onRefresh={handleRefresh}
                        onVerify={() => handleVerify(item)}
                        router={router}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Flex justify="center" css={{ mt: "$12", pb: "$10" }}>
            <Pagination
              color="primary"
              shadow
              noMargin
              total={meta.totalPages}
              initialPage={page}
              page={page}
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
