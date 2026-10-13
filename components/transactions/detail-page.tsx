"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Undo2,
  Package,
  User as UserIcon,
  GraduationCap,
} from "lucide-react";
import paymentsService from "../../services/payments";
import { formatMinor } from "../../utils/formatMoney";
import { formatDateTime } from "../../utils/formatDate";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
  refunded: "bg-[#7047EB]/10 text-[#7047EB]",
};

const personLabel = (p: any): string => {
  if (!p) return "—";
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  return name || p.email || "—";
};

const Row = ({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-2.5 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="break-all text-right font-medium text-gray-900">
      {value}
    </span>
  </div>
);

export default function TransactionDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "refund" | "reconcile">(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRefund, setConfirmRefund] = useState(false);
  const [reason, setReason] = useState("");

  const { data: txn, isLoading, refetch } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => paymentsService.getTransaction(id),
    enabled: !!id,
  });

  const isFirstParty = !txn?.sellerId;
  const canRefund = txn?.status === "paid";
  const pseRefund = txn?.provider === "pse";
  const canReconcile = ["pending", "processing"].includes(txn?.status);

  async function doRefund() {
    setBusy("refund");
    setError(null);
    try {
      await paymentsService.refund(id, { reason: reason || undefined });
      setConfirmRefund(false);
      await refetch();
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
      await paymentsService.reconcile(id);
      await refetch();
    } catch (e: any) {
      const m = e?.response?.data?.message || "Reconcile failed.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f5ff] via-white to-white">
      <header className="flex h-16 items-center justify-between border-b bg-white/70 px-6 shadow-sm backdrop-blur-md">
        <button
          onClick={() => router.push("/transactions")}
          className="rounded-lg p-2 transition hover:bg-[#7047EB]/10"
        >
          <ArrowLeft className="h-5 w-5 text-[#7047EB]" />
        </button>
        <h5 className="text-lg font-semibold text-[#7047EB]">Transaction</h5>
        <span className="w-9" />
      </header>

      {isLoading ? (
        <div className="p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            <div className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-white" />
          </div>
        </div>
      ) : !txn ? (
        <div className="p-20 text-center text-gray-500">Transaction not found.</div>
      ) : (
        <div className="p-6">
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* What + who */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#7047EB]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {txn.area}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[txn.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {txn.status}
                </span>
              </div>
              <Row
                label="Item"
                value={
                  <span
                    className={
                      txn.reference?.available === false
                        ? "italic text-gray-400"
                        : ""
                    }
                  >
                    {txn.reference?.label ?? "—"}
                  </span>
                }
              />
              <Row
                label={
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" /> Teacher
                  </span>
                }
                value={
                  isFirstParty ? (
                    <span className="text-gray-500">Platform (first-party)</span>
                  ) : (
                    <>
                      {personLabel(txn.sellerId)}
                      {txn.sellerId?.email && (
                        <span className="block text-xs text-gray-400">
                          {txn.sellerId.email}
                        </span>
                      )}
                    </>
                  )
                }
              />
              <Row
                label={
                  <span className="inline-flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" /> Buyer
                  </span>
                }
                value={
                  <>
                    {personLabel(txn.buyerId)}
                    {txn.buyerId?.email && (
                      <span className="block text-xs text-gray-400">
                        {txn.buyerId.email}
                      </span>
                    )}
                  </>
                }
              />
              <Row label="Provider" value={String(txn.provider).toUpperCase()} />
              <Row label="Provider ref" value={txn.providerRef || "—"} />
              <Row label="Paid at" value={formatDateTime(txn.paidAt)} />
              <Row label="Created" value={formatDateTime(txn.createdAt)} />
              {txn.failureReason && (
                <Row label="Note" value={txn.failureReason} />
              )}
            </div>

            {/* Money split */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Money split
              </h4>
              <Row
                label="Gross (buyer paid)"
                value={formatMinor(txn.grossMinor, txn.currency)}
              />
              <Row
                label={`Platform commission (${txn.commissionPercent}%)`}
                value={formatMinor(txn.commissionMinor, txn.currency)}
              />
              <Row
                label="Teacher net"
                value={
                  <span className="font-bold text-[#7047EB]">
                    {formatMinor(txn.netMinor, txn.currency)}
                  </span>
                }
              />
              <Row label="Currency" value={txn.currency} />
            </div>

            {/* Payout */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Payout
              </h4>
              <Row
                label="Payout status"
                value={<span className="capitalize">{txn.payoutStatus}</span>}
              />
              <Row label="Payout id" value={txn.payoutId || "—"} />

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-4 space-y-3">
                {canReconcile && (
                  <button
                    onClick={doReconcile}
                    disabled={busy !== null}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busy === "reconcile" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
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
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Undo2 className="h-4 w-4" />
                    {pseRefund ? "Refund via Wompi dashboard" : "Refund"}
                  </button>
                )}

                {canRefund && confirmRefund && (
                  <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">
                      This refunds real money and cannot be undone.
                    </p>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason (optional)"
                      className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmRefund(false)}
                        disabled={busy !== null}
                        className="h-10 flex-1 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={doRefund}
                        disabled={busy !== null}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {busy === "refund" && (
                          <Loader2 className="h-4 w-4 animate-spin" />
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
      )}
    </div>
  );
}
