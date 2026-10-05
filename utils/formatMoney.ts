/** Currencies Intl treats as having no minor unit. Keep in sync with the backend. */
const ZERO_DECIMAL = new Set(["COP", "JPY", "KRW", "CLP", "VND"]);

/** Formats an integer minor-unit amount for display in its currency. */
export function formatMinor(amountMinor: number, currency: string): string {
  const code = (currency || "USD").toUpperCase();
  const divisor = ZERO_DECIMAL.has(code) ? 1 : 100;
  const major = (amountMinor || 0) / divisor;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(major);
  } catch {
    return `${major.toFixed(ZERO_DECIMAL.has(code) ? 0 : 2)} ${code}`;
  }
}
