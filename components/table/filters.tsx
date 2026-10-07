import { Dropdown } from "@nextui-org/react";
import React from "react";
import { Search, Calendar, ChevronDown, Download, X } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: any) => void;
  statusOptions?: { key: string; label: string }[];
  emailVerified?: string;
  onEmailVerifiedChange?: (value: any) => void;
  onExport?: () => void;
  addButton?: React.ReactNode;
}

const PRIMARY = "#7047EB";

/** One outlined filter control; fills with brand colour when a value is set. */
function FilterChip({
  active,
  label,
  children,
}: {
  active: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold capitalize transition-all ${
        active
          ? "border-[#7047EB] bg-[#7047EB]/10 text-[#7047EB]"
          : "border-[#e6e3f0] bg-white text-gray-600 hover:border-[#7047EB]/40"
      }`}
    >
      {children}
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 opacity-70" />
    </button>
  );
}

export const TableFilters = ({
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  status,
  onStatusChange,
  statusOptions,
  emailVerified,
  onEmailVerifiedChange,
  onExport,
  addButton,
}: Props) => {
  const statusActive = Boolean(status && status !== "all");
  const verifiedActive = Boolean(emailVerified && emailVerified !== "all");
  const dateActive = Boolean(startDate || endDate);
  const anyActive =
    statusActive || verifiedActive || dateActive || Boolean(searchTerm);

  const clearAll = () => {
    onSearchChange("");
    onStatusChange?.("all");
    onEmailVerifiedChange?.("all");
    onStartDateChange?.("");
    onEndDateChange?.("");
  };

  const statusLabel =
    statusActive && statusOptions
      ? statusOptions.find((o) => o.key === status)?.label || status
      : "Status";

  const verifiedLabel =
    emailVerified === "true"
      ? "Verified"
      : emailVerified === "false"
        ? "Not verified"
        : "Verification";

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ece9f6] bg-white px-5 py-4 shadow-sm">
      {/* Left: filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-[320px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-[#e6e3f0] bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
          />
        </div>

        {/* Status */}
        {statusOptions && onStatusChange && (
          <Dropdown>
            <Dropdown.Trigger>
              <div>
                <FilterChip active={statusActive} label={statusLabel} />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu
              aria-label="Status Filter"
              onAction={onStatusChange}
              selectedKeys={status ? [status] : []}
              css={{ borderRadius: "16px" }}
            >
              {[{ key: "all", label: "All Status" }, ...statusOptions].map(
                (opt) => (
                  <Dropdown.Item key={opt.key}>{opt.label}</Dropdown.Item>
                ),
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Verification */}
        {onEmailVerifiedChange && (
          <Dropdown>
            <Dropdown.Trigger>
              <div>
                <FilterChip active={verifiedActive} label={verifiedLabel} />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu
              aria-label="Email Verification Filter"
              onAction={onEmailVerifiedChange}
              selectedKeys={emailVerified ? [emailVerified] : []}
              css={{ borderRadius: "16px" }}
            >
              <Dropdown.Item key="all">All Verification</Dropdown.Item>
              <Dropdown.Item key="true">Verified</Dropdown.Item>
              <Dropdown.Item key="false">Not Verified</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Date range — grouped From → To */}
        {onStartDateChange && onEndDateChange && (
          <div
            className={`inline-flex h-11 items-center gap-1 rounded-xl border px-3 transition-all ${
              dateActive
                ? "border-[#7047EB] bg-[#7047EB]/5"
                : "border-[#e6e3f0] bg-white"
            }`}
          >
            <Calendar
              className="h-4 w-4 shrink-0"
              style={{ color: dateActive ? PRIMARY : "#9ca3af" }}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              aria-label="From date"
              className="w-[120px] bg-transparent text-sm text-gray-700 outline-none"
            />
            <span className="text-gray-300">–</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              aria-label="To date"
              className="w-[120px] bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        )}

        {/* Clear */}
        {anyActive && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {addButton}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#7047EB] px-5 font-bold text-white shadow-lg shadow-[#7047EB]/20 transition-all hover:bg-[#5f37d4]"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
};
