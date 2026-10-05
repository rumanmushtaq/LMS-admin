import { describe, it, expect } from "vitest";
import { formatMinor } from "./formatMoney";

describe("formatMinor", () => {
  it("formats USD minor units as dollars", () => {
    expect(formatMinor(12345, "USD")).toBe("$123.45");
  });

  it("formats zero-decimal COP without dividing by 100", () => {
    // 50000 COP minor units = 50,000 pesos, not 500.
    const out = formatMinor(50000, "COP");
    expect(out).toContain("50,000");
  });

  it("falls back gracefully for an unknown currency", () => {
    expect(formatMinor(100, "")).toBe("$1.00");
  });
});
