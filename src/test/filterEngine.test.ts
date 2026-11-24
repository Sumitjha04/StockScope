import { describe, it, expect, beforeAll } from "vitest";
import { generate5000Stocks } from "../lib/stockGenerator";
import { executeFilterEngine, evaluateRule } from "../lib/filterEngine";
import { Stock } from "../types/stock";
import { ActiveFilterRule } from "../types/filter";

describe("Filter Engine Benchmark & Logic Tests", () => {
  let stocks: Stock[];

  beforeAll(() => {
    stocks = generate5000Stocks(5200);
  });

  it("should have generated 5,000+ stocks in the universe", () => {
    expect(stocks.length).toBeGreaterThanOrEqual(5000);
  });

  it("benchmark: should filter 5,000+ stocks in under 200ms (Target: < 200 ms)", () => {
    const rules: ActiveFilterRule[] = [
      { id: "1", criterionId: "peRatio", operator: "lessThanOrEqual", value: 25 },
      { id: "2", criterionId: "roe", operator: "greaterThanOrEqual", value: 15 },
      { id: "3", criterionId: "debtToEquity", operator: "lessThanOrEqual", value: 1.0 },
    ];

    const { results, filterTimeMs } = executeFilterEngine(stocks, rules, "AND");

    // Must be well below target 200ms
    expect(filterTimeMs).toBeLessThan(200);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(stocks.length);

    // Verify all filtered stocks strictly satisfy the rules
    results.forEach((s) => {
      expect(s.fundamentals.peRatio).toBeLessThanOrEqual(25);
      expect(s.fundamentals.roe).toBeGreaterThanOrEqual(15);
      expect(s.fundamentals.debtToEquity).toBeLessThanOrEqual(1.0);
    });
  });

  it("should correctly handle OR logic combination", () => {
    const rules: ActiveFilterRule[] = [
      { id: "1", criterionId: "sector", operator: "equals", value: "Information Technology" },
      { id: "2", criterionId: "sector", operator: "equals", value: "Healthcare & Pharma" },
    ];

    const { results } = executeFilterEngine(stocks, rules, "OR");

    expect(results.length).toBeGreaterThan(0);
    results.forEach((s) => {
      const match = s.sector === "Information Technology" || s.sector === "Healthcare & Pharma";
      expect(match).toBe(true);
    });
  });

  it("should correctly evaluate boolean criteria like Golden Cross", () => {
    const rules: ActiveFilterRule[] = [
      { id: "gc", criterionId: "goldenCross", operator: "isTrue", value: true },
    ];

    const { results } = executeFilterEngine(stocks, rules, "AND");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((s) => {
      expect(s.technicals.goldenCross).toBe(true);
    });
  });

  it("should filter with text search query matching ticker and name", () => {
    const { results } = executeFilterEngine(stocks, [], "AND", "RELIANCE");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((s) => s.ticker === "RELIANCE")).toBe(true);
  });
});
