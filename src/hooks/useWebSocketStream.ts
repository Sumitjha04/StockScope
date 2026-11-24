"use client";

import { useEffect, useRef } from "react";
import { useStockStore } from "../store/useStockStore";
import { useBenchmarkStore } from "../store/useBenchmarkStore";
import { generateBatchTicks } from "../lib/gbmSimulator";

export function useWebSocketStream() {
  const stocks = useStockStore((state) => state.stocks);
  const isInitialized = useStockStore((state) => state.isInitialized);
  const isStreamActive = useStockStore((state) => state.isStreamActive);
  const speedMultiplier = useStockStore((state) => state.speedMultiplier);
  const applyBatchTicks = useStockStore((state) => state.applyBatchTicks);
  const clearFlash = useStockStore((state) => state.clearFlash);

  const setSocketStatus = useBenchmarkStore((state) => state.setSocketStatus);
  const setTicksPerSecond = useBenchmarkStore((state) => state.setTicksPerSecond);
  const setLatencyMs = useBenchmarkStore((state) => state.setLatencyMs);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tickCountRef = useRef(0);
  const lastSecRef = useRef(Date.now());

  useEffect(() => {
    if (!isInitialized || stocks.length === 0) return;

    if (!isStreamActive) {
      setSocketStatus("paused");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setSocketStatus("connected");

    // Interval interval calculation based on speed multiplier
    // Base: 500ms per batch
    const intervalMs = Math.max(150, Math.floor(600 / speedMultiplier));

    timerRef.current = setInterval(() => {
      // 1. Simulate minor latency jitter (12ms - 32ms)
      const simulatedLatency = Math.floor(14 + Math.random() * 16);
      setLatencyMs(simulatedLatency);

      // 2. Generate batch ticks via GBM simulator
      const batchSize = Math.floor(25 * speedMultiplier);
      const ticks = generateBatchTicks(stocks, batchSize, speedMultiplier);

      applyBatchTicks(ticks);

      // Track throughput
      tickCountRef.current += ticks.length;
      const now = Date.now();
      if (now - lastSecRef.current >= 1000) {
        setTicksPerSecond(tickCountRef.current);
        tickCountRef.current = 0;
        lastSecRef.current = now;
      }

      // Schedule clear flash animation after 1000ms
      setTimeout(() => {
        ticks.forEach((t) => clearFlash(t.ticker));
      }, 1000);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    isInitialized,
    stocks,
    isStreamActive,
    speedMultiplier,
    applyBatchTicks,
    clearFlash,
    setSocketStatus,
    setTicksPerSecond,
    setLatencyMs,
  ]);
}
