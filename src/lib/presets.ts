import { ScreenerPreset } from "../types/filter";

export const SCREENER_PRESETS: ScreenerPreset[] = [
  {
    id: "value_champions",
    name: "Value Champions",
    tagline: "Low P/E, High ROE & Conservative Debt",
    description: "Identifies undervalued, highly profitable companies with solid balance sheets (Warren Buffett style).",
    icon: "Gem",
    logicalOperator: "AND",
    rules: [
      { criterionId: "peRatio", operator: "lessThanOrEqual", value: 20 },
      { criterionId: "roe", operator: "greaterThanOrEqual", value: 18 },
      { criterionId: "debtToEquity", operator: "lessThanOrEqual", value: 0.8 },
      { criterionId: "dvmComposite", operator: "greaterThanOrEqual", value: 65 },
    ],
  },
  {
    id: "rsi_oversold_reversal",
    name: "Oversold Reversal",
    tagline: "RSI < 35 with Volume Spike",
    description: "Stocks dumped into oversold territory showing sudden institutional volume accumulation.",
    icon: "TrendingDown",
    logicalOperator: "AND",
    rules: [
      { criterionId: "rsi14", operator: "lessThanOrEqual", value: 35 },
      { criterionId: "volumeSpike", operator: "isTrue", value: true },
      { criterionId: "distFrom52WLow", operator: "greaterThanOrEqual", value: 5 },
    ],
  },
  {
    id: "high_growth_tech",
    name: "High Growth Leaders",
    tagline: "EPS Growth > 25% & Strong Margins",
    description: "Rapidly expanding market leaders with high revenue growth and robust profit margins.",
    icon: "Rocket",
    logicalOperator: "AND",
    rules: [
      { criterionId: "epsGrowthYoY", operator: "greaterThanOrEqual", value: 25 },
      { criterionId: "revGrowthYoY", operator: "greaterThanOrEqual", value: 20 },
      { criterionId: "profitMargin", operator: "greaterThanOrEqual", value: 15 },
    ],
  },
  {
    id: "golden_cross_bullish",
    name: "Golden Cross Trend",
    tagline: "SMA 50 > SMA 200 & Above SMA 50",
    description: "Classic bullish technical breakout setup where the 50-day moving average crosses above the 200-day.",
    icon: "Zap",
    logicalOperator: "AND",
    rules: [
      { criterionId: "goldenCross", operator: "isTrue", value: true },
      { criterionId: "aboveSma50", operator: "isTrue", value: true },
      { criterionId: "changePercent", operator: "greaterThanOrEqual", value: 0.5 },
    ],
  },
  {
    id: "dividend_kings",
    name: "Dividend Kings",
    tagline: "Yield > 3.0% & ROCE > 18%",
    description: "Cash-rich companies paying generous dividend yields while maintaining exceptional return on capital.",
    icon: "Coins",
    logicalOperator: "AND",
    rules: [
      { criterionId: "dividendYield", operator: "greaterThanOrEqual", value: 3.0 },
      { criterionId: "roce", operator: "greaterThanOrEqual", value: 18 },
      { criterionId: "debtToEquity", operator: "lessThanOrEqual", value: 0.6 },
    ],
  },
  {
    id: "smallcap_breakout",
    name: "Smallcap Breakout",
    tagline: "Near 52W High with Squeeze Contraction",
    description: "Small and Micro caps within 5% of all-time highs breaking out from a Bollinger Band volatility squeeze.",
    icon: "Flame",
    logicalOperator: "AND",
    rules: [
      { criterionId: "marketCapCategory", operator: "equals", value: "Small" },
      { criterionId: "distFrom52WHigh", operator: "greaterThanOrEqual", value: -5 },
      { criterionId: "changePercent", operator: "greaterThanOrEqual", value: 1.5 },
    ],
  },
];
