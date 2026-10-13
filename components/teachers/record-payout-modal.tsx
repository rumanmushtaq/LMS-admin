"use client";

import { useState } from "react";
import { Loader2, X, Wallet } from "lucide-react";
import paymentsService from "../../services/payments";
import { formatMinor } from "../../utils/formatMoney";

interface Props {
  tutorId: string;
  owedMinor: number;
  currency: string;
  onClose: () => void;
  onDone: () => void;
}

export function RecordPayoutModal({
  tutorId,
  owedMinor,
  currency,
  onClose,
  onDone,
}: Props) {
  const [method, setMethod] = useState("bank");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await paymentsService.recordPayout(tutorId, {
        paymentIds: "all_owed",
        method,
        note: note || undefined,
        reference: reference || undefined,
      });
      onDone();
    } catch (e: any) {
      const m = e?.response?.data?.message || "Could not record payout.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-[#7047EB]" />
            <h3 className="text-lg font-bold text-gray-800">Record payout</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl bg-[#7047EB]/5 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Paying out (all owed)
            </p>
            <p className="mt-1 text-2xl font-black text-[#7047EB]">
              {formatMinor(owedMinor, currency)}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7047EB]"
            >
              <option value="bank">Bank transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Reference (optional)
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. bank transaction id"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7047EB]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything to remember"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7047EB]"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t p-5">
          <button
            onClick={onClose}
            disabled={busy}
            className="h-11 flex-1 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy || owedMinor <= 0}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#7047EB] font-bold text-white hover:bg-[#5f37d4] disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm payout
          </button>
        </div>
      </div>
    </div>
  );
}
