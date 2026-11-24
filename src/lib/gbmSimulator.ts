import { Stock, StockTick } from "../types/stock";

/**
 * Standard Normal Box-Muller transform generator for Gaussian random variable Z ~ N(0, 1)
 */
export function generateGaussianNoise(): number {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Step stock price using Geometric Brownian Motion (GBM)
 * S(t + dt) = S(t) * exp((mu - 0.5 * sigma^2) * dt + sigma * sqrt(dt) * Z)
 */
export function simulateGBMPrice(
  currentPrice: number,
  volatilityDaily: number, // annualized or daily volatility
  driftDaily = 0.0002,     // slight upward equity drift
  dt = 1 / (6.25 * 3600)   // time delta representing a second of trading day
): number {
  const z = generateGaussianNoise();
  const driftTerm = (driftDaily - 0.5 * Math.pow(volatilityDaily, 2)) * dt;
  const diffusionTerm = volatilityDaily * Math.sqrt(dt) * z;
  const newPrice = currentPrice * Math.exp(driftTerm + diffusionTerm);
  return Number(newPrice.toFixed(2));
}

/**
 * Generate simulated batch tick updates for randomly selected active stocks
 */
export function generateBatchTicks(
  stocks: Stock[],
  batchSize = 25,
  speedMultiplier = 1
): StockTick[] {
  if (stocks.length === 0) return [];
  const ticks: StockTick[] = [];
  const totalStocks = stocks.length;
  const now = Date.now();

  const actualBatchSize = Math.min(totalStocks, batchSize * speedMultiplier);

  // Pick random indices
  const sampledIndices = new Set<number>();
  while (sampledIndices.size < actualBatchSize) {
    sampledIndices.add(Math.floor(Math.random() * totalStocks));
  }

  sampledIndices.forEach((idx) => {
    const stock = stocks[idx];
    const newLtp = simulateGBMPrice(
      stock.ltp,
      stock.volatilityDaily,
      0.0003,
      (1 / 3600) * speedMultiplier
    );

    const change = Number((newLtp - stock.prevClose).toFixed(2));
    const changePercent = Number(((change / stock.prevClose) * 100).toFixed(2));
    const newHigh = Math.max(stock.high, newLtp);
    const newLow = Math.min(stock.low, newLtp);
    const volIncrement = Math.floor(Math.random() * 500 * speedMultiplier) + 10;

    ticks.push({
      id: stock.id,
      ticker: stock.ticker,
      ltp: newLtp,
      change,
      changePercent,
      high: newHigh,
      low: newLow,
      volume: stock.volume + volIncrement,
      timestamp: now,
    });
  });

  return ticks;
}
