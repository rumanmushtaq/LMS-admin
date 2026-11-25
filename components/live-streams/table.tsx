import React, { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  endTeacherStream,
  getTeacherStreams,
  TeacherStreamRow,
} from "../../services/liveStreams";
import { formatDateTime } from "../../utils/formatDate";

const STATUS_TABS = [
  { key: "live", label: "Live now" },
  { key: "ended", label: "Ended" },
  { key: "all", label: "All" },
];

const ENDED_BY_LABEL: Record<string, string> = {
  tutor: "Teacher",
  admin: "Admin",
  system: "Auto (camera stopped)",
};

function StatusPill({ row }: { row: TeacherStreamRow }) {
  if (row.active && row.status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
        ● LIVE
      </span>
    );
  }
  if (row.active) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        Setting up
      </span>
    );
  }
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
      Ended
    </span>
  );
}

/**
 * Who is streaming now and recent streams. Admins can end a stream here; they
 * cannot watch one (teacher streams are for students only).
 */
export const LiveStreamsTable = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("live");

  const { data, isPending } = useQuery({
    queryKey: ["teacher-streams", status],
    queryFn: () => getTeacherStreams(status),
    staleTime: 15_000,
    // Live state changes on its own (teachers start and stop), so keep it fresh.
    refetchInterval: 30_000,
    placeholderData: keepPreviousData,
  });
  const rows = data ?? [];

  const endMutation = useMutation({
    mutationFn: (streamId: string) => endTeacherStream(streamId),
    onSuccess: (_res, streamId) => {
      // Mark the row ended in every cached list right away, then re-sync
      // quietly (the "Live now" tab drops it) without blanking the table.
      queryClient.setQueriesData<TeacherStreamRow[]>(
        { queryKey: ["teacher-streams"] },
        (old) =>
          old?.map((s) =>
            s._id === streamId
              ? {
                  ...s,
                  active: false,
                  status: "ended",
                  endedBy: "admin",
                  endedAt: new Date().toISOString(),
                }
              : s,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["teacher-streams"] });
    },
    onError: (error) => {
      console.error("Failed to end stream:", error);
    },
  });

  const confirmEnd = (row: TeacherStreamRow) => {
    const who = row.tutor?.name || "this teacher";
    if (window.confirm(`End the live stream of ${who}? Students watching will be cut off.`)) {
      endMutation.mutate(row._id);
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
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
        {isPending ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-semibold text-gray-600">
              {status === "live" ? "No teacher is live right now" : "No streams yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Teachers start streams from their dashboard with “Go live”.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f4f4f5] text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">Teacher</th>
                  <th className="p-3 text-left">Stream</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Viewers</th>
                  <th className="p-3 text-left">Started</th>
                  <th className="p-3 text-left">Ended</th>
                  <th className="p-3 text-center" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-b border-gray-100 hover:bg-[#7047EB]/5 transition">
                    <td className="p-3">
                      <p className="font-semibold text-gray-800">{row.tutor?.name || "—"}</p>
                      <p className="text-xs text-gray-400">{row.tutor?.email}</p>
                    </td>
                    <td className="p-3 text-gray-700">{row.title || "Live stream"}</td>
                    <td className="p-3">
                      <StatusPill row={row} />
                    </td>
                    <td className="p-3 text-gray-700">{row.viewerCount}</td>
                    <td className="p-3 text-gray-600">
                      {row.startedAt ? formatDateTime(row.startedAt) : "—"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {row.endedAt ? (
                        <>
                          {formatDateTime(row.endedAt)}
                          {row.endedBy && (
                            <span className="block text-xs text-gray-400">
                              by {ENDED_BY_LABEL[row.endedBy] ?? row.endedBy}
                            </span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.active && (
                        <button
                          onClick={() => confirmEnd(row)}
                          disabled={endMutation.isPending && endMutation.variables === row._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gray-800 hover:bg-black disabled:opacity-50"
                        >
                          End stream
                        </button>
                      )}
                    </td>
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
