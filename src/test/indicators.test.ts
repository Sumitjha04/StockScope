import { describe, it, expect } from "vitest";
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands,
  calculateVolumeProfile,
} from "../lib/indicators";
import { OHLCV } from "../types/stock";

describe("Technical Chart Indicators Calculations", () => {
  const priceData = [
    100, 102, 104, 103, 105, 107, 106, 108, 110, 109,
    111, 113, 112, 114, 116, 115, 117, 119, 118, 120,
    122, 121, 123, 125, 124,
  ];

  it("calculates SMA accurately", () => {
    const sma = calculateSMA(priceData, 5);
    expect(sma[0]).toBeNull();
    expect(sma[3]).toBeNull();
    // 5th element index 4: (100+102+104+103+105)/5 = 102.8
    expect(sma[4]).toBe(102.8);
  });

  it("calculates EMA accurately", () => {
    const ema = calculateEMA(priceData, 5);
    expect(ema[0]).toBeNull();
    expect(ema[4]).toBe(102.8);
    expect(ema[5]).toBeGreaterThan(102.8);
  });

  it("calculates RSI(14) with bounded values between 0 and 100", () => {
    const rsi = calculateRSI(priceData, 14);
    const validValues = rsi.filter((v): v is number => v !== null);
    expect(validValues.length).toBeGreaterThan(0);
    validValues.forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    });
  });

  it("calculates Bollinger Bands with upper > middle > lower", () => {
    const bb = calculateBollingerBands(priceData, 10, 2);
    const valid = bb.filter((p) => p.upper !== null);
    expect(valid.length).toBeGreaterThan(0);

    valid.forEach((p) => {
      expect(p.upper!).toBeGreaterThanOrEqual(p.middle!);
      expect(p.middle!).toBeGreaterThanOrEqual(p.lower!);
      expect(p.bandwidth!).toBeGreaterThan(0);
    });
  });

  it("calculates Volume Profile and identifies POC (Point of Control)", () => {
    const mockCandles: OHLCV[] = [
      { time: "2026-01-01", open: 100, high: 105, low: 99, close: 104, volume: 1000 },
      { time: "2026-01-02", open: 104, high: 108, low: 103, close: 107, volume: 5000 },
      { time: "2026-01-03", open: 107, high: 109, low: 106, close: 108, volume: 2000 },
    ];

    const profile = calculateVolumeProfile(mockCandles, 5);
    expect(profile.length).toBe(5);
    const poc = profile.find((b) => b.isPoc);
    expect(poc).toBeDefined();
    expect(poc!.volume).toBeGreaterThan(0);
  });
});
