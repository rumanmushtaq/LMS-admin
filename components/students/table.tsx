import { Text, Pagination } from "@nextui-org/react";
import React, { useEffect, useState, useCallback } from "react";
import { Box } from "../styles/box";
import { columns, statusOptions } from "./data";
import { RenderCell } from "./render-cell";
import adminService from "../../services/admin";
import { TableFilters } from "../table/filters";
import { TableSkeleton } from "../table/table-skeleton";
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
  // Selection driven only by the checkboxes, never a row click.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleOne = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

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
  }, [
    fetchStudents,
    searchTerm,
    status,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

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
  }, [
    searchTerm,
    debouncedSearch,
    fetchStudents,
    status,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  // Effect for filters
  useEffect(() => {
    fetchStudents(1, searchTerm, status, startDate, endDate, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    startDate,
    endDate,
    searchTerm,
    fetchStudents,
    sortBy,
    sortOrder,
  ]);

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
        <TableSkeleton cols={columns.length} rows={8} />
      ) : students.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          css={{ height: "320px", gap: "$4" }}
        >
          <Text b size={16} color="$accents7">
            No students found
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
                        students.length > 0 &&
                        students.every((s) => selectedIds.has(s._id))
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? new Set(students.map((s) => s._id))
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
                {students.map((item: any) => (
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
                          {RenderCell({
                            student: item,
                            columnKey: c.uid,
                            onRefresh: handleRefresh,
                          })}
                        </td>
                      ))}
                    <td className="p-3 text-center align-middle">
                      {RenderCell({
                        student: item,
                        columnKey: "actions",
                        onRefresh: handleRefresh,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
