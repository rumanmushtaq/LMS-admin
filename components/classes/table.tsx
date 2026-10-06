import React, { useEffect, useState, useCallback } from "react";
import { columns } from "./data";
import { RenderCell } from "./render-cell";
import { getAllClasses, ClassSession } from "../../services/classes";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "MISSED", label: "Missed" },
];

export const TableWrapper = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  const fetchClasses = useCallback(async (statusFilter: string) => {
    try {
      setLoading(true);
      const res = await getAllClasses(statusFilter);
      // The API wraps the payload as { success, data: [...] }. Unwrap to the
      // array defensively so the list never receives a non-iterable.
      const list = Array.isArray(res)
        ? res
        : (res?.data?.data ?? res?.data ?? []);
      setClasses(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses(status);
  }, [fetchClasses, status]);

  const handleRefresh = () => fetchClasses(status);

  return (
    <div className="w-full mt-6">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
              status === t.key
                ? "bg-[#7047EB] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-semibold text-gray-600">No classes found</p>
            <p className="text-sm text-gray-400 mt-1">
              Nothing matches this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f4f4f5] text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.uid}
                      className={`p-3 ${
                        c.uid === "actions" ? "text-center" : "text-left"
                      }`}
                    >
                      {c.uid === "actions" ? "" : c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((item: any) => (
                  <tr
                    key={item?._id}
                    className="border-b border-gray-100 hover:bg-[#7047EB]/5 transition"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.uid}
                        className={`p-3 align-middle ${
                          c.uid === "actions" ? "text-center" : ""
                        }`}
                      >
                        <RenderCell
                          key={c.uid}
                          classItem={item}
                          columnKey={c.uid}
                          onRefresh={handleRefresh}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
