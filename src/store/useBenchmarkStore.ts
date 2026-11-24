import { create } from "zustand";

interface BenchmarkState {
  filterTimeMs: number;
  sortTimeMs: number;
  scrollFps: number;
  lcpLoadTimeSec: number;
  ticksPerSecond: number;
  socketStatus: "connected" | "reconnecting" | "paused" | "disconnected";
  latencyMs: number;
  totalStocksCount: number;
  filteredCount: number;

  setFilterTime: (ms: number) => void;
  setSortTime: (ms: number) => void;
  setScrollFps: (fps: number) => void;
  setLcpLoadTime: (sec: number) => void;
  setTicksPerSecond: (tps: number) => void;
  setSocketStatus: (status: "connected" | "reconnecting" | "paused" | "disconnected") => void;
  setLatencyMs: (ms: number) => void;
  setCounts: (total: number, filtered: number) => void;
}

export const useBenchmarkStore = create<BenchmarkState>((set) => ({
  filterTimeMs: 12.4, // baseline initialized
  sortTimeMs: 8.2,
  scrollFps: 60,
  lcpLoadTimeSec: 0.94,
  ticksPerSecond: 25,
  socketStatus: "connected",
  latencyMs: 18,
  totalStocksCount: 5200,
  filteredCount: 5200,

  setFilterTime: (ms) => set({ filterTimeMs: ms }),
  setSortTime: (ms) => set({ sortTimeMs: ms }),
  setScrollFps: (fps) => set({ scrollFps: fps }),
  setLcpLoadTime: (sec) => set({ lcpLoadTimeSec: sec }),
  setTicksPerSecond: (tps) => set({ ticksPerSecond: tps }),
  setSocketStatus: (status) => set({ socketStatus: status }),
  setLatencyMs: (ms) => set({ latencyMs: ms }),
  setCounts: (total, filtered) => set({ totalStocksCount: total, filteredCount: filtered }),
}));
