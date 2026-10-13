"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  FileText,
} from "lucide-react";
import paymentsService from "../../services/payments";
import { formatMinor } from "../../utils/formatMoney";
import { formatDate } from "../../utils/formatDate";
import { RecordPayoutModal } from "./record-payout-modal";

const personLabel = (p: any): string => {
  if (!p) return "—";
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  return name || p.email || "—";
};

export function EarningsSection({ tutorId }: { tutorId: string }) {
  const queryClient = useQueryClient();
  const [showPayout, setShowPayout] = useState(false);

  const { data: earnings, isLoading } = useQuery({
    queryKey: ["tutor-earnings", tutorId],
    queryFn: () => paymentsService.getTutorEarnings(tutorId),
    enabled: !!tutorId,
  });

  const { data: payouts } = useQuery({
    queryKey: ["tutor-payouts", tutorId],
    queryFn: () => paymentsService.listPayouts(tutorId),
    enabled: !!tutorId,
  });

  const currency = earnings?.currency ?? "USD";
  const totals = earnings?.totals;
  const byArea = earnings?.byArea;
  const txns: any[] = earnings?.transactions?.data ?? [];
  const history: any[] = Array.isArray(payouts) ? payouts : [];

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["tutor-earnings", tutorId] });
    queryClient.invalidateQueries({ queryKey: ["tutor-payouts", tutorId] });
  };

  const cards = [
    {
      label: "Earned (net)",
      value: totals?.netMinor ?? 0,
      icon: <TrendingUp className="h-4 w-4" />,
      tone: "text-gray-800",
    },
    {
      label: "Owed now",
      value: totals?.owedMinor ?? 0,
      icon: <Clock className="h-4 w-4" />,
      tone: "text-amber-600",
    },
    {
      label: "Paid out",
      value: totals?.paidOutMinor ?? 0,
      icon: <CheckCircle2 className="h-4 w-4" />,
      tone: "text-green-600",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#ece9f6] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#7047EB]" />
          <h4 className="text-base font-bold text-gray-800">
            Earnings &amp; Payouts
          </h4>
        </div>
        <button
          onClick={() => setShowPayout(true)}
          disabled={!totals || (totals?.owedMinor ?? 0) <= 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7047EB] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#7047EB]/20 transition-all hover:bg-[#5f37d4] disabled:opacity-50"
        >
          <Wallet className="h-4 w-4" />
          Record Payout
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {c.icon}
                  {c.label}
                </div>
                <p className={`mt-1 text-xl font-black ${c.tone}`}>
                  {formatMinor(c.value, currency)}
                </p>
              </div>
            ))}
          </div>

          {/* By source */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#7047EB]/5 px-3 py-1.5 font-semibold text-gray-700">
              <BookOpen className="h-3.5 w-3.5 text-[#7047EB]" />
              Classes {formatMinor(byArea?.classes?.netMinor ?? 0, currency)}
              <span className="text-gray-400">
                ({byArea?.classes?.paymentCount ?? 0})
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#7047EB]/5 px-3 py-1.5 font-semibold text-gray-700">
              <FileText className="h-3.5 w-3.5 text-[#7047EB]" />
              Materials {formatMinor(byArea?.materials?.netMinor ?? 0, currency)}
              <span className="text-gray-400">
                ({byArea?.materials?.paymentCount ?? 0})
              </span>
            </span>
          </div>

          {/* Transactions */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-[#f4f4f5] text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="p-2.5 text-left">Date</th>
                  <th className="p-2.5 text-left">Student</th>
                  <th className="p-2.5 text-left">Item</th>
                  <th className="p-2.5 text-right">Gross</th>
                  <th className="p-2.5 text-right">Platform</th>
                  <th className="p-2.5 text-right">Net</th>
                  <th className="p-2.5 text-left">Payout</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t._id} className="border-t border-gray-100">
                    <td className="p-2.5 text-gray-500">
                      {formatDate(t.paidAt || t.createdAt)}
                    </td>
                    <td className="p-2.5 text-gray-800">
                      {personLabel(t.buyerId)}
                    </td>
                    <td className="p-2.5 text-gray-600">
                      {t.reference?.label ?? "—"}
                    </td>
                    <td className="p-2.5 text-right text-gray-600">
                      {formatMinor(t.grossMinor, t.currency)}
                    </td>
                    <td className="p-2.5 text-right text-gray-400">
                      {formatMinor(t.commissionMinor, t.currency)}
                    </td>
                    <td className="p-2.5 text-right font-semibold text-[#7047EB]">
                      {formatMinor(t.netMinor, t.currency)}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          t.payoutStatus === "paid_out"
                            ? "bg-green-100 text-green-700"
                            : t.payoutStatus === "void"
                              ? "bg-gray-200 text-gray-500"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.payoutStatus === "paid_out"
                          ? "paid"
                          : t.payoutStatus === "void"
                            ? "void"
                            : "owed"}
                      </span>
                    </td>
                  </tr>
                ))}
                {txns.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-6 text-center text-gray-400"
                    >
                      No earnings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Payout history */}
          {history.length > 0 && (
            <div className="mt-5">
              <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Payout history
              </h5>
              <div className="space-y-2">
                {history.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">
                        {formatMinor(p.amountMinor, p.currency)}
                      </span>
                      <span className="ml-2 text-xs capitalize text-gray-400">
                        {p.method}
                        {p.note ? ` · ${p.note}` : ""}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showPayout && (
        <RecordPayoutModal
          tutorId={tutorId}
          owedMinor={totals?.owedMinor ?? 0}
          currency={currency}
          onClose={() => setShowPayout(false)}
          onDone={() => {
            setShowPayout(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
