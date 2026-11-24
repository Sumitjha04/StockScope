export type MarketCapCategory = "Large" | "Mid" | "Small" | "Micro";

export type Sector =
  | "Information Technology"
  | "Financials & Banking"
  | "Healthcare & Pharma"
  | "Energy & Utilities"
  | "Automobile"
  | "Consumer Goods (FMCG)"
  | "Metals & Mining"
  | "Telecom & Media"
  | "Industrials"
  | "Real Estate";

export type IndexCategory =
  | "NIFTY 50"
  | "NIFTY NEXT 50"
  | "NIFTY MIDCAP 150"
  | "NIFTY SMALLCAP 250"
  | "S&P 500 ELITE";

export interface OHLCV {
  time: string; // YYYY-MM-DD or timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  ema20: number;
  ema50: number;
  rsi14: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  bbSqueeze: boolean;
  goldenCross: boolean; // SMA 50 > SMA 200
  deathCross: boolean;  // SMA 50 < SMA 200
  volumeSpike: boolean; // Current volume > 2x 30D average
}

export interface FundamentalData {
  marketCapCr: number; // in Crores INR
  peRatio: number;
  pbRatio: number;
  evEbitda: number;
  dividendYield: number; // %
  roe: number;           // %
  roce: number;          // %
  debtToEquity: number;
  currentRatio: number;
  epsGrowthYoY: number;  // %
  revGrowthYoY: number;  // %
  profitMargin: number;  // %
  freeCashFlowCr: number;
  institutionalHolding: number; // % FII + DII
  dvmScore: {
    valuation: number;   // 1 to 100
    quality: number;     // 1 to 100
    momentum: number;    // 1 to 100
    composite: number;   // average
  };
}

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  sector: Sector;
  index: IndexCategory;
  marketCapCategory: MarketCapCategory;
  
  // Real-time Pricing
  ltp: number; // Last Traded Price
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  volume30DAvg: number;
  
  // 52-Week Range
  week52High: number;
  week52Low: number;
  distFrom52WHigh: number; // %
  distFrom52WLow: number;  // %
  
  // Risk & Volatility
  beta: number;
  volatilityDaily: number; // for GBM simulation
  
  // Fundamentals
  fundamentals: FundamentalData;
  
  // Technicals
  technicals: TechnicalIndicators;

  // Mini Sparkline history for quick preview
  sparkline: number[];
}

export interface StockTick {
  id: string;
  ticker: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}
