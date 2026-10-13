"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings as SettingsIcon, Percent, Check } from "lucide-react";
import paymentsService from "../../services/payments";

const AREAS: { key: string; label: string; hint: string }[] = [
  { key: "shop", label: "Shop", hint: "Merch / physical goods" },
  { key: "materials", label: "Materials / Notes", hint: "Tutor notes & files" },
  { key: "classes", label: "Classes", hint: "Group class seats" },
];

/**
 * Module-scoped so it keeps its DOM identity across re-renders. Defined inside
 * the view, every keystroke would remount the input and drop focus.
 */
const PercentInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="relative w-28">
    <input
      type="number"
      min={0}
      max={100}
      step={0.1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[#e6e3f0] bg-white py-2 pl-3 pr-8 text-sm text-gray-800 shadow-sm outline-none transition-all focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
    />
    <Percent className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
  </div>
);

export default function SettingsView() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["payment-settings"],
    queryFn: () => paymentsService.getSettings(),
  });

  const [percents, setPercents] = useState<Record<string, string>>({});
  const [defaultPercent, setDefaultPercent] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Seed the inputs from the loaded settings.
  useEffect(() => {
    if (!data) return;
    const byArea: Record<string, string> = {};
    for (const a of AREAS) {
      const found = (data.commissions ?? []).find(
        (c: any) => c.area === a.key,
      );
      byArea[a.key] = String(
        found?.percent ?? data.defaultCommissionPercent ?? 0,
      );
    }
    setPercents(byArea);
    setDefaultPercent(String(data.defaultCommissionPercent ?? 0));
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      paymentsService.updateSettings({
        commissions: AREAS.map((a) => ({
          area: a.key,
          percent: Number(percents[a.key]),
        })),
        defaultCommissionPercent: Number(defaultPercent),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (e: any) => {
      const m = e?.response?.data?.message || "Could not save settings.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
    },
  });

  const invalid =
    AREAS.some((a) => {
      const n = Number(percents[a.key]);
      return percents[a.key] === "" || isNaN(n) || n < 0 || n > 100;
    }) ||
    defaultPercent === "" ||
    Number(defaultPercent) < 0 ||
    Number(defaultPercent) > 100;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7047EB]/10 text-[#7047EB]">
          <SettingsIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Payment Settings</h3>
          <p className="text-sm text-gray-500">
            Commission the platform keeps per revenue area. Applied to all new
            payments; the rest goes to the tutor.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-2xl space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl border border-[#ece9f6] bg-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-[#ece9f6] bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Commission rates
            </h4>
            <div className="space-y-3">
              {AREAS.map((a) => (
                <div
                  key={a.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{a.label}</p>
                    <p className="text-xs text-gray-400">{a.hint}</p>
                  </div>
                  <PercentInput
                    value={percents[a.key] ?? ""}
                    onChange={(v) =>
                      setPercents((p) => ({ ...p, [a.key]: v }))
                    }
                  />
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 rounded-xl bg-[#7047EB]/5 px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-800">Default</p>
                  <p className="text-xs text-gray-400">
                    Fallback when an area has no explicit rate
                  </p>
                </div>
                <PercentInput
                  value={defaultPercent}
                  onChange={setDefaultPercent}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece9f6] bg-white p-6 shadow-sm">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Currency &amp; providers
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                {data?.currency ?? "USD"}
              </span>
              {(data?.enabledProviders ?? []).map((p: string) => (
                <span
                  key={p}
                  className="rounded-lg bg-[#7047EB]/10 px-3 py-1 font-semibold uppercase text-[#7047EB]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => mutation.mutate()}
              disabled={invalid || mutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7047EB] px-6 py-2.5 font-bold text-white shadow-lg shadow-[#7047EB]/20 transition-all hover:bg-[#5f37d4] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
