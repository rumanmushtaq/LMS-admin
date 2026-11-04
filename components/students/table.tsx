import { Text, Pagination } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import {
  keepPreviousData,
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

/** Shape cached under ["students", ...] — RenderCell edits rows in place. */
interface StudentPage {
  students: Student[];
  meta: Meta;
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
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  // Debounced search — the query key only follows the settled term, and a
  // new term starts again from page 1.
  const updateSearch = useMemo(
    () =>
      debounce((term: string) => {
        setDebouncedSearch(term);
        setPage(1);
      }, 400),
    [],
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateSearch(term);
  };

  const studentsKey = [
    "students",
    page,
    debouncedSearch,
    status,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ] as const;

  // Fetch students with pagination and filters
  const { data, isPending, isFetching } = useQuery({
    queryKey: studentsKey,
    queryFn: async (): Promise<StudentPage> => {
      try {
        const response = await adminService.getStudents({
          page,
          limit: 10,
          search: debouncedSearch,
          status: status === "all" ? undefined : status,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy,
          sortOrder,
        });

        return {
          students: response.data.data || [],
          meta: response.data.meta,
        };
      } catch (error) {
        console.error("Error fetching students:", error);
        throw error;
      }
    },
    // Keep the current rows on screen while the next page/filter loads, so
    // only the very first load shows the skeleton.
    placeholderData: keepPreviousData,
  });

  const students = data?.students ?? [];
  const meta: Meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };
  const loading = isPending;

  // Handle page change
  const handlePageChange = (next: number) => setPage(next);

  // Handle refresh after actions. RenderCell has already patched the cache
  // and queued a quiet refetch; all that is left is stepping back when a
  // delete emptied a later page.
  const handleRefresh = () => {
    const current = queryClient.getQueryData<StudentPage>(studentsKey);
    if (current && current.students.length === 0 && page > 1) {
      setPage((p) => p - 1);
    }
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
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={(key) => {
          setStatus(key as string);
          setPage(1);
        }}
        statusOptions={statusOptions}
        startDate={startDate}
        onStartDateChange={(value) => {
          setStartDate(value);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        addButton={addButton}
        onExport={() => console.log("Exporting...")}
      />

      {loading ? (
        <TableSkeleton cols={columns.length} rows={8} />
      ) : students.length === 0 && !isFetching ? (
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
                          <RenderCell
                            student={item}
                            columnKey={c.uid}
                            onRefresh={handleRefresh}
                          />
                        </td>
                      ))}
                    <td className="p-3 text-center align-middle">
                      <RenderCell
                        student={item}
                        columnKey="actions"
                        onRefresh={handleRefresh}
                      />
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
              page={page}
              onChange={handlePageChange}
            />
          </Flex>
        </>
      )}
    </Box>
  );
};
