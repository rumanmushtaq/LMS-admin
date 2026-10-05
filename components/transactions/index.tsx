"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  Search,
  Loader2,
  Download,
  RefreshCw,
  Undo2,
  X,
} from "lucide-react";
import { Spinner } from "@nextui-org/react";
import paymentsService, { TransactionQuery } from "../../services/payments";
import { formatMinor } from "../../utils/formatMoney";

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
  refunded: "bg-purple-100 text-purple-700",
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
  const [selected, setSelected] = useState<Txn | null>(null);

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
    <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <header className="h-16 bg-white/70 backdrop-blur-md border-b flex items-center justify-between px-6 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>
        <h5 className="text-lg font-semibold text-purple-700">Transactions</h5>
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
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition disabled:opacity-50"
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
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {s?.count ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatMinor(s?.grossMinor ?? 0, "USD")}
                </p>
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
                  ? "bg-purple-600 text-white"
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
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600 min-w-[120px]"
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
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600 min-w-[120px]"
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
              className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {listQuery.isLoading ? (
            <div className="p-20 flex justify-center">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
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
                {rows.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => setSelected(t)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-3 text-gray-600">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {buyerLabel(t)}
                    </td>
                    <td className="p-3 capitalize text-gray-600">{t.area}</td>
                    <td className="p-3 uppercase text-gray-600">
                      {t.provider}
                    </td>
                    <td className="p-3 font-semibold text-purple-600">
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
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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
                  className="px-2 py-1 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-600"
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
                className="px-4 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DetailDrawer
          txn={selected}
          onClose={() => setSelected(null)}
          onChanged={(fresh) => {
            setSelected(fresh);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function DetailDrawer({
  txn,
  onClose,
  onChanged,
}: {
  txn: Txn;
  onClose: () => void;
  onChanged: (fresh: Txn) => void;
}) {
  const [busy, setBusy] = useState<null | "refund" | "reconcile">(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRefund, setConfirmRefund] = useState(false);
  const [reason, setReason] = useState("");

  const canRefund = txn.status === "paid";
  const pseRefund = txn.provider === "pse";
  const canReconcile = ["pending", "processing"].includes(txn.status);

  async function doRefund() {
    setBusy("refund");
    setError(null);
    try {
      const fresh = await paymentsService.refund(txn._id, {
        reason: reason || undefined,
      });
      setConfirmRefund(false);
      onChanged(fresh as Txn);
    } catch (e: any) {
      const m = e?.response?.data?.message || "Refund failed.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
    } finally {
      setBusy(null);
    }
  }

  async function doReconcile() {
    setBusy("reconcile");
    setError(null);
    try {
      const fresh = await paymentsService.reconcile(txn._id);
      onChanged(fresh as Txn);
    } catch (e: any) {
      const m = e?.response?.data?.message || "Reconcile failed.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
    } finally {
      setBusy(null);
    }
  }

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right break-all">
        {value}
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-gray-800">Transaction</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <Row label="ID" value={txn._id} />
          <Row label="Buyer" value={buyerLabel(txn)} />
          <Row label="Buyer email" value={txn.buyerId?.email || "—"} />
          <Row label="Area" value={<span className="capitalize">{txn.area}</span>} />
          <Row label="Provider" value={txn.provider.toUpperCase()} />
          <Row label="Provider ref" value={txn.providerRef || "—"} />
          <Row label="Gross" value={formatMinor(txn.grossMinor, txn.currency)} />
          <Row label="Commission" value={formatMinor(txn.commissionMinor, txn.currency)} />
          <Row label="Net (seller)" value={formatMinor(txn.netMinor, txn.currency)} />
          <Row label="Currency" value={txn.currency} />
          <Row
            label="Status"
            value={
              <span
                className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                  STATUS_STYLES[txn.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {txn.status}
              </span>
            }
          />
          <Row label="Payout" value={<span className="capitalize">{txn.payoutStatus}</span>} />
          <Row
            label="Paid at"
            value={txn.paidAt ? new Date(txn.paidAt).toLocaleString() : "—"}
          />
          <Row
            label="Created"
            value={
              txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "—"
            }
          />
          {txn.failureReason && (
            <Row label="Note" value={txn.failureReason} />
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {canReconcile && (
              <button
                onClick={doReconcile}
                disabled={busy !== null}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white h-11 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {busy === "reconcile" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Reconcile with provider
              </button>
            )}

            {canRefund && !confirmRefund && (
              <button
                onClick={() => setConfirmRefund(true)}
                disabled={pseRefund}
                title={
                  pseRefund
                    ? "Refund PSE payments in the Wompi dashboard"
                    : undefined
                }
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white h-11 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo2 className="w-4 h-4" />
                {pseRefund ? "Refund via Wompi dashboard" : "Refund"}
              </button>
            )}

            {canRefund && confirmRefund && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-red-700">
                  This refunds real money and cannot be undone.
                </p>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmRefund(false)}
                    disabled={busy !== null}
                    className="flex-1 h-10 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={doRefund}
                    disabled={busy !== null}
                    className="flex-1 h-10 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {busy === "refund" && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Confirm refund
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
