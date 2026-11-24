import { OHLCV } from "../types/stock";

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= period) {
      sum -= data[i - period];
    }
    if (i >= period - 1) {
      result.push(Number((sum / period).toFixed(2)));
    } else {
      result.push(null);
    }
  }
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  let initialSum = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      initialSum += data[i];
      result.push(null);
    } else if (i === period - 1) {
      initialSum += data[i];
      const sma = initialSum / period;
      result.push(Number(sma.toFixed(2)));
    } else {
      const prevEma = result[i - 1]!;
      const currentEma = (data[i] - prevEma) * multiplier + prevEma;
      result.push(Number(currentEma.toFixed(2)));
    }
  }
  return result;
}

/**
 * Relative Strength Index (RSI) using Wilder's Smoothing
 */
export function calculateRSI(data: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (data.length < period + 1) {
    return data.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  result.push(null); // for index 0

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
    result.push(null);
  }

  avgGain /= period;
  avgLoss /= period;

  const firstRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRsi = 100 - 100 / (1 + firstRs);
  result[period] = Number(firstRsi.toFixed(2));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(Number(rsi.toFixed(2)));
    }
  }

  return result;
}

/**
 * Bollinger Bands (Upper, Middle SMA, Lower)
 */
export interface BollingerBandPoint {
  upper: number | null;
  middle: number | null;
  lower: number | null;
  bandwidth: number | null;
}

export function calculateBollingerBands(
  data: number[],
  period = 20,
  stdDevMultiplier = 2
): BollingerBandPoint[] {
  const result: BollingerBandPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push({ upper: null, middle: null, lower: null, bandwidth: null });
      continue;
    }

    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((acc, val) => acc + val, 0) / period;

    const variance =
      slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upper = Number((mean + stdDevMultiplier * stdDev).toFixed(2));
    const lower = Number((mean - stdDevMultiplier * stdDev).toFixed(2));
    const middle = Number(mean.toFixed(2));
    const bandwidth = middle > 0 ? Number((((upper - lower) / middle) * 100).toFixed(2)) : 0;

    result.push({ upper, middle, lower, bandwidth });
  }

  return result;
}

/**
 * Volume Profile computation for price bins
 */
export interface VolumeBin {
  priceLevel: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  isPoc: boolean; // Point of Control (highest volume node)
}

export function calculateVolumeProfile(candles: OHLCV[], binsCount = 24): VolumeBin[] {
  if (candles.length === 0) return [];

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  for (const c of candles) {
    if (c.low < minPrice) minPrice = c.low;
    if (c.high > maxPrice) maxPrice = c.high;
  }

  if (minPrice === maxPrice) {
    return [{ priceLevel: minPrice, volume: 1, buyVolume: 0.5, sellVolume: 0.5, isPoc: true }];
  }

  const step = (maxPrice - minPrice) / binsCount;
  const bins: VolumeBin[] = Array.from({ length: binsCount }, (_, idx) => ({
    priceLevel: Number((minPrice + idx * step + step / 2).toFixed(2)),
    volume: 0,
    buyVolume: 0,
    sellVolume: 0,
    isPoc: false,
  }));

  for (const c of candles) {
    const avgPrice = (c.open + c.high + c.low + c.close) / 4;
    let binIdx = Math.floor((avgPrice - minPrice) / step);
    if (binIdx >= binsCount) binIdx = binsCount - 1;
    if (binIdx < 0) binIdx = 0;

    const isBull = c.close >= c.open;
    bins[binIdx].volume += c.volume;
    if (isBull) {
      bins[binIdx].buyVolume += c.volume * 0.65;
      bins[binIdx].sellVolume += c.volume * 0.35;
    } else {
      bins[binIdx].buyVolume += c.volume * 0.35;
      bins[binIdx].sellVolume += c.volume * 0.65;
    }
  }

  // Find POC (Point of Control)
  let maxVol = -1;
  let pocIdx = 0;
  for (let i = 0; i < bins.length; i++) {
    if (bins[i].volume > maxVol) {
      maxVol = bins[i].volume;
      pocIdx = i;
    }
  }
  if (bins[pocIdx]) {
    bins[pocIdx].isPoc = true;
  }

  return bins;
}
