import { Stock, Sector, IndexCategory, MarketCapCategory, OHLCV } from "../types/stock";
import { calculateSMA, calculateEMA, calculateRSI, calculateBollingerBands } from "./indicators";

const SECTORS: Sector[] = [
  "Information Technology",
  "Financials & Banking",
  "Healthcare & Pharma",
  "Energy & Utilities",
  "Automobile",
  "Consumer Goods (FMCG)",
  "Metals & Mining",
  "Telecom & Media",
  "Industrials",
  "Real Estate",
];

const PROMINENT_STOCKS = [
  { ticker: "RELIANCE", name: "Reliance Industries Ltd", sector: "Energy & Utilities", index: "NIFTY 50", cap: "Large", ltp: 2940.5 },
  { ticker: "TCS", name: "Tata Consultancy Services Ltd", sector: "Information Technology", index: "NIFTY 50", cap: "Large", ltp: 3820.0 },
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Financials & Banking", index: "NIFTY 50", cap: "Large", ltp: 1680.4 },
  { ticker: "INFY", name: "Infosys Ltd", sector: "Information Technology", index: "NIFTY 50", cap: "Large", ltp: 1855.2 },
  { ticker: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Financials & Banking", index: "NIFTY 50", cap: "Large", ltp: 1245.8 },
  { ticker: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom & Media", index: "NIFTY 50", cap: "Large", ltp: 1580.0 },
  { ticker: "ITC", name: "ITC Ltd", sector: "Consumer Goods (FMCG)", index: "NIFTY 50", cap: "Large", ltp: 472.3 },
  { ticker: "SBIN", name: "State Bank of India", sector: "Financials & Banking", index: "NIFTY 50", cap: "Large", ltp: 815.6 },
  { ticker: "LT", name: "Larsen & Toubro Ltd", sector: "Industrials", index: "NIFTY 50", cap: "Large", ltp: 3540.0 },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "Consumer Goods (FMCG)", index: "NIFTY 50", cap: "Large", ltp: 2420.0 },
  { ticker: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Automobile", index: "NIFTY 50", cap: "Large", ltp: 980.5 },
  { ticker: "SUNPHARMA", name: "Sun Pharmaceutical Industries", sector: "Healthcare & Pharma", index: "NIFTY 50", cap: "Large", ltp: 1740.0 },
  { ticker: "TATASTEEL", name: "Tata Steel Ltd", sector: "Metals & Mining", index: "NIFTY 50", cap: "Large", ltp: 155.4 },
  { ticker: "MARUTI", name: "Maruti Suzuki India Ltd", sector: "Automobile", index: "NIFTY 50", cap: "Large", ltp: 12250.0 },
  { ticker: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "Financials & Banking", index: "NIFTY 50", cap: "Large", ltp: 6950.0 },
  { ticker: "ADANIENT", name: "Adani Enterprises Ltd", sector: "Industrials", index: "NIFTY 50", cap: "Large", ltp: 2820.0 },
  { ticker: "TITAN", name: "Titan Company Ltd", sector: "Consumer Goods (FMCG)", index: "NIFTY 50", cap: "Large", ltp: 3340.0 },
  { ticker: "WIPRO", name: "Wipro Ltd", sector: "Information Technology", index: "NIFTY NEXT 50", cap: "Large", ltp: 560.2 },
  { ticker: "ZOMATO", name: "Zomato Ltd", sector: "Information Technology", index: "NIFTY NEXT 50", cap: "Large", ltp: 275.4 },
  { ticker: "JIOFIN", name: "Jio Financial Services Ltd", sector: "Financials & Banking", index: "NIFTY NEXT 50", cap: "Large", ltp: 320.1 },
  { ticker: "BEL", name: "Bharat Electronics Ltd", sector: "Industrials", index: "NIFTY NEXT 50", cap: "Large", ltp: 295.0 },
  { ticker: "HAL", name: "Hindustan Aeronautics Ltd", sector: "Industrials", index: "NIFTY NEXT 50", cap: "Large", ltp: 4420.0 },
  { ticker: "TRENT", name: "Trent Ltd", sector: "Consumer Goods (FMCG)", index: "NIFTY 50", cap: "Large", ltp: 6850.0 },
  { ticker: "VEDL", name: "Vedanta Ltd", sector: "Metals & Mining", index: "NIFTY NEXT 50", cap: "Mid", ltp: 460.0 },
  { ticker: "DLF", name: "DLF Ltd", sector: "Real Estate", index: "NIFTY NEXT 50", cap: "Large", ltp: 840.0 },
  { ticker: "NVDA", name: "Nvidia Corporation", sector: "Information Technology", index: "S&P 500 ELITE", cap: "Large", ltp: 142.5 },
  { ticker: "AAPL", name: "Apple Inc.", sector: "Information Technology", index: "S&P 500 ELITE", cap: "Large", ltp: 228.0 },
  { ticker: "MSFT", name: "Microsoft Corporation", sector: "Information Technology", index: "S&P 500 ELITE", cap: "Large", ltp: 425.0 },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Information Technology", index: "S&P 500 ELITE", cap: "Large", ltp: 178.5 },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Goods (FMCG)", index: "S&P 500 ELITE", cap: "Large", ltp: 198.0 },
];

const PREFIXES = [
  "ALPHA", "DELTA", "OMEGA", "APEX", "ZENITH", "NEXUS", "PRIME", "STELLAR", "VORTEX", "AURORA",
  "GLOBAL", "BHARAT", "INDUS", "HIM", "ORIENT", "EVEREST", "PACIFIC", "ATLANTIC", "METRO", "SUN",
  "DYNAMIC", "TURBO", "KINETIC", "AGILE", "QUANTUM", "SYNTH", "MATRIX", "VECTOR", "COSMO", "ASTRA",
  "GREEN", "SOLAR", "CLEAN", "HYDRO", "ECO", "BIO", "PHARMA", "GENO", "MEDIC", "LIFE",
  "FIN", "CAPITAL", "CREDIT", "ASSET", "TRUST", "SECURE", "EQUITY", "VALU", "FORTUNE", "WEALTH"
];

const SUFFIXES = [
  "TECH", "CORP", "SYS", "LABS", "VENTURES", "INDUSTRIES", "METALS", "ENERGY", "INFRA", "POWER",
  "SOLUTIONS", "FINANCE", "SECURITIES", "GLOBAL", "INDIA", "HOLDINGS", "MOTORS", "RESOURCES",
  "CHEMICALS", "LOGISTICS", "NETWORKS", "COMMUNICATIONS", "HEALTHCARE", "DIAGNOSTICS", "RETAIL"
];

// Seeded pseudorandom number generator for consistent dataset across refreshes
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generate5000Stocks(total = 5200): Stock[] {
  const stocks: Stock[] = [];

  // 1. Prominent Stocks
  PROMINENT_STOCKS.forEach((p, idx) => {
    stocks.push(createStockRecord(idx, p.ticker, p.name, p.sector as Sector, p.index as IndexCategory, p.cap as MarketCapCategory, p.ltp));
  });

  // 2. Procedurally Generate Remaining Stocks to exceed 5,000
  let seed = 42;
  const existingTickers = new Set(stocks.map((s) => s.ticker));

  const countToGenerate = total - stocks.length;
  for (let i = 0; i < countToGenerate; i++) {
    const idNum = stocks.length + 1;
    const r1 = seededRandom(seed++);
    const r2 = seededRandom(seed++);
    const r3 = seededRandom(seed++);
    const r4 = seededRandom(seed++);

    const pIdx = Math.floor(r1 * PREFIXES.length);
    const sIdx = Math.floor(r2 * SUFFIXES.length);
    let ticker = `${PREFIXES[pIdx]}${SUFFIXES[sIdx]}`.slice(0, 9);
    if (existingTickers.has(ticker)) {
      ticker = `${ticker}${idNum % 100}`.slice(0, 10);
    }
    existingTickers.add(ticker);

    const name = `${PREFIXES[pIdx].charAt(0) + PREFIXES[pIdx].slice(1).toLowerCase()} ${SUFFIXES[sIdx].charAt(0) + SUFFIXES[sIdx].slice(1).toLowerCase()} Enterprise Ltd`;
    const sector = SECTORS[Math.floor(r3 * SECTORS.length)];

    let cap: MarketCapCategory = "Small";
    let index: IndexCategory = "NIFTY SMALLCAP 250";
    if (r4 > 0.85) {
      cap = "Large";
      index = "NIFTY 50";
    } else if (r4 > 0.55) {
      cap = "Mid";
      index = "NIFTY MIDCAP 150";
    } else if (r4 > 0.15) {
      cap = "Small";
      index = "NIFTY SMALLCAP 250";
    } else {
      cap = "Micro";
      index = "NIFTY SMALLCAP 250";
    }

    const basePrice = cap === "Large" ? 800 + r1 * 3000 : cap === "Mid" ? 250 + r2 * 1200 : 25 + r3 * 600;
    stocks.push(createStockRecord(idNum, ticker, name, sector, index, cap, basePrice, seed));
  }

  return stocks;
}

function createStockRecord(
  seedId: number,
  ticker: string,
  name: string,
  sector: Sector,
  index: IndexCategory,
  marketCapCategory: MarketCapCategory,
  targetPrice: number,
  seed = seedId * 777
): Stock {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const ltp = Number(targetPrice.toFixed(2));
  const changePercent = Number(((rnd() - 0.48) * 7.5).toFixed(2)); // slightly bull bias
  const prevClose = Number((ltp / (1 + changePercent / 100)).toFixed(2));
  const change = Number((ltp - prevClose).toFixed(2));

  const intradaySpread = ltp * (0.01 + rnd() * 0.03);
  const high = Number((Math.max(ltp, prevClose) + intradaySpread * rnd()).toFixed(2));
  const low = Number((Math.min(ltp, prevClose) - intradaySpread * rnd()).toFixed(2));
  const open = Number((low + (high - low) * rnd()).toFixed(2));

  const week52High = Number((Math.max(high, ltp * (1.05 + rnd() * 0.45))).toFixed(2));
  const week52Low = Number((Math.min(low, ltp * (0.55 + rnd() * 0.35))).toFixed(2));
  const distFrom52WHigh = Number((((ltp - week52High) / week52High) * 100).toFixed(2));
  const distFrom52WLow = Number((((ltp - week52Low) / week52Low) * 100).toFixed(2));

  const baseVol = marketCapCategory === "Large" ? 1500000 : marketCapCategory === "Mid" ? 500000 : 80000;
  const volumeMultiplier = 0.4 + rnd() * 2.2;
  const volume = Math.floor(baseVol * volumeMultiplier);
  const volume30DAvg = baseVol;

  const marketCapCr =
    marketCapCategory === "Large"
      ? Math.floor(45000 + rnd() * 850000)
      : marketCapCategory === "Mid"
      ? Math.floor(12000 + rnd() * 32000)
      : marketCapCategory === "Small"
      ? Math.floor(2500 + rnd() * 9500)
      : Math.floor(200 + rnd() * 2200);

  const peRatio = Number((8 + rnd() * 65).toFixed(2));
  const pbRatio = Number((0.8 + rnd() * 12).toFixed(2));
  const evEbitda = Number((5 + rnd() * 28).toFixed(2));
  const dividendYield = Number((rnd() > 0.3 ? rnd() * 5.5 : 0).toFixed(2));
  const roe = Number((4 + rnd() * 32).toFixed(2));
  const roce = Number((5 + rnd() * 36).toFixed(2));
  const debtToEquity = Number((rnd() * 2.5).toFixed(2));
  const currentRatio = Number((0.8 + rnd() * 2.8).toFixed(2));
  const epsGrowthYoY = Number(((rnd() - 0.25) * 45).toFixed(2));
  const revGrowthYoY = Number(((rnd() - 0.15) * 35).toFixed(2));
  const profitMargin = Number((3 + rnd() * 24).toFixed(2));
  const freeCashFlowCr = Math.floor(marketCapCr * (0.01 + rnd() * 0.08));
  const institutionalHolding = Number((15 + rnd() * 65).toFixed(2));

  // DVM Scores (Valuation, Quality, Momentum)
  const valScore = Math.floor(Math.max(10, Math.min(99, 100 - (peRatio / 65) * 70 + (roe / 32) * 20)));
  const qualScore = Math.floor(Math.max(15, Math.min(99, (roce / 36) * 40 + (profitMargin / 24) * 30 + (institutionalHolding / 80) * 30)));
  const momScore = Math.floor(Math.max(10, Math.min(99, 50 + changePercent * 4 + (distFrom52WHigh + 20))));
  const compositeScore = Math.floor((valScore + qualScore + momScore) / 3);

  // Technical calculations
  const sma20 = Number((ltp * (0.94 + rnd() * 0.12)).toFixed(2));
  const sma50 = Number((ltp * (0.91 + rnd() * 0.18)).toFixed(2));
  const sma200 = Number((ltp * (0.85 + rnd() * 0.30)).toFixed(2));
  const ema20 = Number((ltp * (0.96 + rnd() * 0.08)).toFixed(2));
  const ema50 = Number((ltp * (0.93 + rnd() * 0.14)).toFixed(2));
  const rsi14 = Number((22 + rnd() * 56).toFixed(2));

  const bbWidth = ltp * (0.04 + rnd() * 0.08);
  const bbUpper = Number((ltp + bbWidth).toFixed(2));
  const bbLower = Number((ltp - bbWidth).toFixed(2));
  const bbMiddle = Number(ltp.toFixed(2));
  const bbSqueeze = (bbUpper - bbLower) / ltp < 0.05;

  const goldenCross = sma50 > sma200;
  const deathCross = sma50 < sma200;
  const volumeSpike = volume > volume30DAvg * 1.8;

  // Mini sparkline (last 10 closes)
  const sparkline: number[] = [prevClose];
  let currentVal = prevClose;
  for (let k = 0; k < 9; k++) {
    currentVal = currentVal * (1 + (rnd() - 0.49) * 0.02);
    sparkline.push(Number(currentVal.toFixed(2)));
  }
  sparkline.push(ltp);

  return {
    id: `STK_${seedId}`,
    ticker,
    name,
    sector,
    index,
    marketCapCategory,
    ltp,
    open,
    high,
    low,
    prevClose,
    change,
    changePercent,
    volume,
    volume30DAvg,
    week52High,
    week52Low,
    distFrom52WHigh,
    distFrom52WLow,
    beta: Number((0.45 + rnd() * 1.45).toFixed(2)),
    volatilityDaily: Number((0.012 + rnd() * 0.022).toFixed(4)),
    fundamentals: {
      marketCapCr,
      peRatio,
      pbRatio,
      evEbitda,
      dividendYield,
      roe,
      roce,
      debtToEquity,
      currentRatio,
      epsGrowthYoY,
      revGrowthYoY,
      profitMargin,
      freeCashFlowCr,
      institutionalHolding,
      dvmScore: {
        valuation: valScore,
        quality: qualScore,
        momentum: momScore,
        composite: compositeScore,
      },
    },
    technicals: {
      sma20,
      sma50,
      sma200,
      ema20,
      ema50,
      rsi14,
      bbUpper,
      bbMiddle,
      bbLower,
      bbSqueeze,
      goldenCross,
      deathCross,
      volumeSpike,
    },
    sparkline,
  };
}

/**
 * Generate historical daily OHLCV candles for the candlestick chart modal
 */
export function generateCandlestickHistory(baseStock: Stock, days = 120): OHLCV[] {
  const candles: OHLCV[] = [];
  let price = baseStock.ltp * 0.85; // starting price 120 days ago
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // skip weekends
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const timeStr = d.toISOString().split("T")[0];

    const dailyPct = (Math.random() - 0.48) * (baseStock.volatilityDaily * 100);
    const open = Number(price.toFixed(2));
    const close = Number((open * (1 + dailyPct / 100)).toFixed(2));
    const wickHigh = Math.max(open, close) + Math.random() * (open * 0.015);
    const wickLow = Math.min(open, close) - Math.random() * (open * 0.015);

    const high = Number(wickHigh.toFixed(2));
    const low = Number(Math.max(0.1, wickLow).toFixed(2));
    const volume = Math.floor(baseStock.volume30DAvg * (0.5 + Math.random() * 1.2));

    candles.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  // Ensure last candle matches current stock LTP
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = baseStock.ltp;
    last.high = Math.max(last.high, baseStock.high);
    last.low = Math.min(last.low, baseStock.low);
    last.volume = baseStock.volume;
  }

  return candles;
}
