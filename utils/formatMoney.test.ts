import { describe, it, expect } from "vitest";
import { formatMinor } from "./formatMoney";

describe("formatMinor", () => {
  it("formats USD minor units as dollars", () => {
    expect(formatMinor(12345, "USD")).toBe("$123.45");
  });

  it("formats COP from centavos, as Stripe and Wompi store it", () => {
    // 5,000,000 centavos = 50,000 pesos.
    const out = formatMinor(5000000, "COP");
    expect(out).toContain("50,000");
  });

  it("formats a true zero-decimal currency without dividing", () => {
    expect(formatMinor(500, "JPY")).toContain("500");
  });

  it("falls back gracefully for an unknown currency", () => {
    expect(formatMinor(100, "")).toBe("$1.00");
  });
});
