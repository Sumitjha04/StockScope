import { Stock } from "../types/stock";
import {
  FilterCriterionDefinition,
  ActiveFilterRule,
  LogicalCombination,
  FilterOperator,
} from "../types/filter";

export const AVAILABLE_CRITERIA: FilterCriterionDefinition[] = [
  // 1. General & Index
  {
    id: "sector",
    label: "Sector",
    category: "General",
    type: "select",
    path: "sector",
    defaultOperator: "equals",
    allowedOperators: ["equals", "notEquals"],
    options: [
      { label: "Information Technology", value: "Information Technology" },
      { label: "Financials & Banking", value: "Financials & Banking" },
      { label: "Healthcare & Pharma", value: "Healthcare & Pharma" },
      { label: "Energy & Utilities", value: "Energy & Utilities" },
      { label: "Automobile", value: "Automobile" },
      { label: "Consumer Goods (FMCG)", value: "Consumer Goods (FMCG)" },
      { label: "Metals & Mining", value: "Metals & Mining" },
      { label: "Telecom & Media", value: "Telecom & Media" },
      { label: "Industrials", value: "Industrials" },
      { label: "Real Estate", value: "Real Estate" },
    ],
  },
  {
    id: "index",
    label: "Index",
    category: "General",
    type: "select",
    path: "index",
    defaultOperator: "equals",
    allowedOperators: ["equals", "notEquals"],
    options: [
      { label: "NIFTY 50", value: "NIFTY 50" },
      { label: "NIFTY NEXT 50", value: "NIFTY NEXT 50" },
      { label: "NIFTY MIDCAP 150", value: "NIFTY MIDCAP 150" },
      { label: "NIFTY SMALLCAP 250", value: "NIFTY SMALLCAP 250" },
      { label: "S&P 500 ELITE", value: "S&P 500 ELITE" },
    ],
  },
  {
    id: "marketCapCategory",
    label: "Market Cap Class",
    category: "General",
    type: "select",
    path: "marketCapCategory",
    defaultOperator: "equals",
    allowedOperators: ["equals", "notEquals"],
    options: [
      { label: "Large Cap", value: "Large" },
      { label: "Mid Cap", value: "Mid" },
      { label: "Small Cap", value: "Small" },
      { label: "Micro Cap", value: "Micro" },
    ],
  },

  // 2. Price & Action
  {
    id: "ltp",
    label: "Price (LTP)",
    category: "Price & Action",
    type: "number",
    path: "ltp",
    unit: "₹",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between", "greaterThan", "lessThan"],
    min: 1,
    max: 50000,
    step: 10,
  },
  {
    id: "changePercent",
    label: "1-Day Change %",
    category: "Price & Action",
    type: "number",
    path: "changePercent",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: -20,
    max: 20,
    step: 0.5,
  },
  {
    id: "volume",
    label: "Today's Volume",
    category: "Price & Action",
    type: "number",
    path: "volume",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 10000,
    max: 50000000,
    step: 50000,
  },
  {
    id: "distFrom52WHigh",
    label: "Distance from 52W High",
    category: "Price & Action",
    type: "number",
    path: "distFrom52WHigh",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: -50,
    max: 0,
    step: 1,
    description: "0% means currently at 52-week high",
  },
  {
    id: "distFrom52WLow",
    label: "Distance from 52W Low",
    category: "Price & Action",
    type: "number",
    path: "distFrom52WLow",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: "beta",
    label: "Beta (Volatility vs Index)",
    category: "Price & Action",
    type: "number",
    path: "beta",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 0.1,
    max: 3.0,
    step: 0.1,
  },

  // 3. Valuation
  {
    id: "marketCapCr",
    label: "Market Capitalization",
    category: "Valuation",
    type: "number",
    path: "fundamentals.marketCapCr",
    unit: "Cr ₹",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 100,
    max: 2000000,
    step: 1000,
  },
  {
    id: "peRatio",
    label: "P/E Ratio",
    category: "Valuation",
    type: "number",
    path: "fundamentals.peRatio",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["lessThanOrEqual", "greaterThanOrEqual", "between"],
    min: 1,
    max: 150,
    step: 1,
  },
  {
    id: "pbRatio",
    label: "P/B Ratio",
    category: "Valuation",
    type: "number",
    path: "fundamentals.pbRatio",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["lessThanOrEqual", "greaterThanOrEqual", "between"],
    min: 0.5,
    max: 25,
    step: 0.5,
  },
  {
    id: "evEbitda",
    label: "EV / EBITDA",
    category: "Valuation",
    type: "number",
    path: "fundamentals.evEbitda",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["lessThanOrEqual", "greaterThanOrEqual", "between"],
    min: 2,
    max: 60,
    step: 1,
  },
  {
    id: "dividendYield",
    label: "Dividend Yield",
    category: "Valuation",
    type: "number",
    path: "fundamentals.dividendYield",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 0,
    max: 12,
    step: 0.2,
  },
  {
    id: "dvmComposite",
    label: "DVM Composite Health Score",
    category: "Valuation",
    type: "number",
    path: "fundamentals.dvmScore.composite",
    unit: "/100",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 1,
    max: 100,
    step: 5,
  },
  {
    id: "dvmValuation",
    label: "DVM Valuation Score",
    category: "Valuation",
    type: "number",
    path: "fundamentals.dvmScore.valuation",
    unit: "/100",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 1,
    max: 100,
    step: 5,
  },

  // 4. Financials & Growth
  {
    id: "roe",
    label: "Return on Equity (ROE)",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.roe",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 0,
    max: 50,
    step: 1,
  },
  {
    id: "roce",
    label: "Return on Capital Employed (ROCE)",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.roce",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
    min: 0,
    max: 60,
    step: 1,
  },
  {
    id: "debtToEquity",
    label: "Debt to Equity Ratio",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.debtToEquity",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["lessThanOrEqual", "greaterThanOrEqual"],
    min: 0,
    max: 4,
    step: 0.1,
  },
  {
    id: "currentRatio",
    label: "Current Ratio",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.currentRatio",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 0.5,
    max: 5,
    step: 0.2,
  },
  {
    id: "epsGrowthYoY",
    label: "EPS Growth (YoY)",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.epsGrowthYoY",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: -20,
    max: 80,
    step: 5,
  },
  {
    id: "revGrowthYoY",
    label: "Revenue Growth (YoY)",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.revGrowthYoY",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: -20,
    max: 60,
    step: 5,
  },
  {
    id: "profitMargin",
    label: "Net Profit Margin",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.profitMargin",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 1,
    max: 40,
    step: 1,
  },
  {
    id: "institutionalHolding",
    label: "Institutional Holding (FII+DII)",
    category: "Financials & Growth",
    type: "number",
    path: "fundamentals.institutionalHolding",
    unit: "%",
    defaultOperator: "greaterThanOrEqual",
    allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual"],
    min: 5,
    max: 95,
    step: 5,
  },

  // 5. Technicals
  {
    id: "rsi14",
    label: "RSI (14-period)",
    category: "Technicals",
    type: "number",
    path: "technicals.rsi14",
    defaultOperator: "lessThanOrEqual",
    allowedOperators: ["lessThanOrEqual", "greaterThanOrEqual", "between"],
    min: 10,
    max: 90,
    step: 2,
    description: "<30 is oversold, >70 is overbought",
  },
  {
    id: "goldenCross",
    label: "Golden Cross (SMA 50 > SMA 200)",
    category: "Technicals",
    type: "boolean",
    path: "technicals.goldenCross",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
  },
  {
    id: "deathCross",
    label: "Death Cross (SMA 50 < SMA 200)",
    category: "Technicals",
    type: "boolean",
    path: "technicals.deathCross",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
  },
  {
    id: "bbSqueeze",
    label: "Bollinger Band Squeeze",
    category: "Technicals",
    type: "boolean",
    path: "technicals.bbSqueeze",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
    description: "Volatility contraction signaling breakout",
  },
  {
    id: "volumeSpike",
    label: "Volume Spike (> 1.8x Avg)",
    category: "Technicals",
    type: "boolean",
    path: "technicals.volumeSpike",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
  },
  {
    id: "aboveSma50",
    label: "Price > SMA 50",
    category: "Technicals",
    type: "boolean",
    path: "_custom.aboveSma50",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
  },
  {
    id: "aboveSma200",
    label: "Price > SMA 200",
    category: "Technicals",
    type: "boolean",
    path: "_custom.aboveSma200",
    defaultOperator: "isTrue",
    allowedOperators: ["isTrue", "isFalse"],
  },
];

// Helper to resolve nested path safely and fast
export function getNestedValue(obj: any, path: string): any {
  if (path === "_custom.aboveSma50") {
    return obj.ltp > obj.technicals.sma50;
  }
  if (path === "_custom.aboveSma200") {
    return obj.ltp > obj.technicals.sma200;
  }

  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }
  return current;
}

/**
 * Single rule evaluator
 */
export function evaluateRule(stock: Stock, rule: ActiveFilterRule): boolean {
  const criterion = AVAILABLE_CRITERIA.find((c) => c.id === rule.criterionId);
  if (!criterion) return true;

  const actualValue = getNestedValue(stock, criterion.path);
  if (actualValue === undefined || actualValue === null) return false;

  const targetValue = rule.value;
  const targetSecondary = rule.valueSecondary;

  switch (rule.operator) {
    case "equals":
      return String(actualValue).toLowerCase() === String(targetValue).toLowerCase();

    case "notEquals":
      return String(actualValue).toLowerCase() !== String(targetValue).toLowerCase();

    case "greaterThan":
      return Number(actualValue) > Number(targetValue);

    case "greaterThanOrEqual":
      return Number(actualValue) >= Number(targetValue);

    case "lessThan":
      return Number(actualValue) < Number(targetValue);

    case "lessThanOrEqual":
      return Number(actualValue) <= Number(targetValue);

    case "between":
      const min = Number(targetValue);
      const max = Number(targetSecondary ?? targetValue);
      const val = Number(actualValue);
      return val >= Math.min(min, max) && val <= Math.max(min, max);

    case "contains":
      return String(actualValue).toLowerCase().includes(String(targetValue).toLowerCase());

    case "isTrue":
      return Boolean(actualValue) === true;

    case "isFalse":
      return Boolean(actualValue) === false;

    default:
      return true;
  }
}

/**
 * Filter Engine: parse -> optimize -> execute
 * Returns filtered array and execution time in milliseconds
 */
export function executeFilterEngine(
  stocks: Stock[],
  rules: ActiveFilterRule[],
  logicalOp: LogicalCombination,
  searchQuery = ""
): { results: Stock[]; filterTimeMs: number } {
  const startTime = performance.now();

  const query = searchQuery.trim().toLowerCase();
  const hasQuery = query.length > 0;
  const hasRules = rules.length > 0;

  if (!hasQuery && !hasRules) {
    const filterTimeMs = Number((performance.now() - startTime).toFixed(2));
    return { results: stocks, filterTimeMs };
  }

  const results: Stock[] = [];

  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i];

    // 1. Text Search across ticker, company name, sector
    if (hasQuery) {
      const match =
        stock.ticker.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query);
      if (!match) continue;
    }

    // 2. Active Rules with AND / OR short-circuiting
    if (hasRules) {
      if (logicalOp === "AND") {
        let allPassed = true;
        for (let j = 0; j < rules.length; j++) {
          if (!evaluateRule(stock, rules[j])) {
            allPassed = false;
            break; // short-circuit
          }
        }
        if (allPassed) {
          results.push(stock);
        }
      } else {
        // OR logic
        let anyPassed = false;
        for (let j = 0; j < rules.length; j++) {
          if (evaluateRule(stock, rules[j])) {
            anyPassed = true;
            break; // short-circuit
          }
        }
        if (anyPassed) {
          results.push(stock);
        }
      }
    } else {
      results.push(stock);
    }
  }

  const filterTimeMs = Number((performance.now() - startTime).toFixed(2));
  return { results, filterTimeMs };
}
