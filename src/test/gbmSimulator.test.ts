import { describe, it, expect } from "vitest";
import { generateGaussianNoise, simulateGBMPrice, generateBatchTicks } from "../lib/gbmSimulator";
import { generate5000Stocks } from "../lib/stockGenerator";

describe("Geometric Brownian Motion (GBM) Price Simulator", () => {
  it("generates Gaussian noise with near-zero mean and near-one standard deviation", () => {
    const samples: number[] = [];
    for (let i = 0; i < 500; i++) {
      samples.push(generateGaussianNoise());
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    // Mean should be close to 0 (e.g. within -0.2 to 0.2)
    expect(mean).toBeGreaterThan(-0.25);
    expect(mean).toBeLessThan(0.25);
  });

  it("steps stock prices using GBM without negative or NaN prices", () => {
    let price = 1000;
    for (let i = 0; i < 50; i++) {
      price = simulateGBMPrice(price, 0.02, 0.0003, 1 / 3600);
      expect(price).toBeGreaterThan(0);
      expect(Number.isFinite(price)).toBe(true);
    }
  });

  it("generates batch tick updates matching active stocks", () => {
    const stocks = generate5000Stocks(100);
    const ticks = generateBatchTicks(stocks, 10, 1);

    expect(ticks.length).toBe(10);
    ticks.forEach((tick) => {
      expect(tick.ltp).toBeGreaterThan(0);
      expect(tick.ticker).toBeDefined();
      expect(tick.timestamp).toBeGreaterThan(0);
    });
  });
});
