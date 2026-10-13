"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { ArrowLeft, Search, Download, RefreshCw } from "lucide-react";
import paymentsService, { TransactionQuery } from "../../services/payments";
import { formatMinor } from "../../utils/formatMoney";
import { formatDate } from "../../utils/formatDate";

/** Shared classes for the themed native <select> controls. */
const SELECT_CLASS =
  "appearance-none cursor-pointer rounded-xl border border-[#e6e3f0] bg-white px-4 py-2 pr-9 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-[#7047EB]/40 focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237047EB%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.65rem_center] bg-no-repeat";

const STATUS_TABS = [
  "all",
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
] as const;

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
  refunded: "bg-[#7047EB]/10 text-[#7047EB]",
};

interface Txn {
  _id: string;
  area: string;
  provider: string;
  providerRef: string | null;
  grossMinor: number;
  netMinor: number;
  commissionMinor: number;
  currency: string;
  status: string;
  payoutStatus: string;
  paidAt?: string | null;
  failureReason?: string | null;
  createdAt?: string;
  providerMetadata?: Record<string, any>;
  buyerId?: { firstName?: string; lastName?: string; email?: string } | null;
  sellerId?: { firstName?: string; lastName?: string; email?: string } | null;
}

function buyerLabel(t: Txn): string {
  const b = t.buyerId;
  if (!b) return "—";
  const name = [b.firstName, b.lastName].filter(Boolean).join(" ");
  return name || b.email || "—";
}

export default function TransactionsView() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<string>("all");
  const [area, setArea] = useState("");
  const [provider, setProvider] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const h = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(h);
  }, [search]);

  const query: TransactionQuery = useMemo(
    () => ({
      status: status === "all" ? undefined : status,
      area: area || undefined,
      provider: provider || undefined,
      q: debouncedSearch || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      limit,
    }),
    [status, area, provider, debouncedSearch, from, to, page, limit],
  );

  const listQuery = useQuery<{
    data: Txn[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ["transactions", query],
    queryFn: () => paymentsService.listTransactions(query),
    placeholderData: keepPreviousData,
  });

  const summaryQuery = useQuery<{ byStatus: Record<string, any> }>({
    queryKey: ["transactions-summary", { area, provider, from, to }],
    queryFn: () =>
      paymentsService.getSummary({
        area: area || undefined,
        provider: provider || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const rows: Txn[] = listQuery.data?.data ?? [];
  const totalPages: number = listQuery.data?.totalPages ?? 1;
  const total: number = listQuery.data?.total ?? 0;
  const byStatus: Record<string, any> = summaryQuery.data?.byStatus ?? {};

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
  }

  function exportCsv() {
    const header = [
      "Date",
      "Buyer",
      "Area",
      "Provider",
      "Status",
      "Gross",
      "Currency",
      "ProviderRef",
    ];
    const lines = rows.map((t) =>
      [
        t.createdAt ? new Date(t.createdAt).toISOString() : "",
        buyerLabel(t),
        t.area,
        t.provider,
        t.status,
        (t.grossMinor ?? 0).toString(),
        t.currency,
        t.providerRef ?? "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statCards = [
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "failed", label: "Failed" },
    { key: "refunded", label: "Refunded" },
  ];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#f7f5ff] via-white to-white">
      <header className="h-16 bg-white/70 backdrop-blur-md border-b flex items-center justify-between px-6 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[#7047EB]/10 transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#7047EB]" />
        </button>
        <h5 className="text-lg font-semibold text-[#7047EB]">Transactions</h5>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="flex items-center gap-2 bg-[#7047EB] text-white px-4 py-2 rounded-lg shadow hover:bg-[#5f37d4] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map((c) => {
            const s = byStatus[c.key];
            return (
              <div
                key={c.key}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  {c.label}
                </p>
                {summaryQuery.isFetching ? (
                  <>
                    <div className="mt-2 h-7 w-10 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-1.5 h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {s?.count ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatMinor(s?.grossMinor ?? 0, "USD")}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                status === s
                  ? "bg-[#7047EB] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by provider reference..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7047EB] shadow-sm bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setPage(1);
              }}
              className={`${SELECT_CLASS} min-w-[120px]`}
            >
              <option value="">All Areas</option>
              <option value="shop">Shop</option>
              <option value="materials">Materials</option>
              <option value="classes">Classes</option>
            </select>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setPage(1);
              }}
              className={`${SELECT_CLASS} min-w-[120px]`}
            >
              <option value="">All Providers</option>
              <option value="stripe">Stripe</option>
              <option value="pse">PSE</option>
            </select>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-xl border border-[#e6e3f0] bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-[#7047EB]/40 focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-xl border border-[#e6e3f0] bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all hover:border-[#7047EB]/40 focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
              <thead className="bg-[#f4f4f5] text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Area</th>
                  <th className="p-3 text-left">Provider</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {listQuery.isFetching ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b border-gray-100">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="p-3">
                          <div className="h-4 w-full max-w-[140px] rounded bg-gray-200 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  rows.map((t) => (
                    <tr
                      key={t._id}
                      onClick={() => router.push(`/transactions/${t._id}`)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="p-3 text-gray-600">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {buyerLabel(t)}
                      </td>
                      <td className="p-3 capitalize text-gray-600">{t.area}</td>
                      <td className="p-3 uppercase text-gray-600">
                        {t.provider}
                      </td>
                      <td className="p-3 font-semibold text-[#7047EB]">
                        {formatMinor(t.grossMinor, t.currency)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            STATUS_STYLES[t.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>

        {/* Pagination */}
        {rows.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {rows.length} of {total}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className={`${SELECT_CLASS} py-1`}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-[#7047EB]/10 text-[#7047EB] hover:bg-[#7047EB]/20 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-[#7047EB] text-white hover:bg-[#5f37d4] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

