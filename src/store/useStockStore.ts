import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Stock, StockTick } from "../types/stock";
import { ActiveFilterRule, LogicalCombination } from "../types/filter";
import { SCREENER_PRESETS } from "../lib/presets";

export interface SavedScreener {
  id: string;
  name: string;
  createdAt: string;
  rules: ActiveFilterRule[];
  logicalOperator: LogicalCombination;
}

interface StockStoreState {
  stocks: Stock[];
  stockMap: Map<string, number>; // ticker -> index for O(1) live tick lookups
  isInitialized: boolean;
  
  // Realtime tick flash tracker: ticker -> 'green' | 'red' | null
  tickFlashes: Record<string, "green" | "red">;

  // Watchlist (starred tickers)
  watchlist: string[];
  
  // Saved Screeners
  savedScreeners: SavedScreener[];
  
  // Filter state
  searchQuery: string;
  logicalOperator: LogicalCombination;
  activeRules: ActiveFilterRule[];
  selectedPresetId: string | null;
  
  // Selection
  selectedStock: Stock | null;
  isChartModalOpen: boolean;

  // Realtime Simulation Controls
  isStreamActive: boolean;
  speedMultiplier: number; // 1x, 2x, 5x
  
  // Actions
  setStocks: (stocks: Stock[]) => void;
  applyBatchTicks: (ticks: StockTick[]) => void;
  clearFlash: (ticker: string) => void;
  toggleWatchlist: (ticker: string) => void;
  
  setSearchQuery: (q: string) => void;
  setLogicalOperator: (op: LogicalCombination) => void;
  addRule: (rule: ActiveFilterRule) => void;
  removeRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<ActiveFilterRule>) => void;
  resetFilters: () => void;
  applyPreset: (presetId: string) => void;
  
  saveCurrentScreener: (name: string) => void;
  loadSavedScreener: (screener: SavedScreener) => void;
  deleteSavedScreener: (id: string) => void;
  
  setSelectedStock: (stock: Stock | null) => void;
  setChartModalOpen: (open: boolean) => void;
  setStreamActive: (active: boolean) => void;
  setSpeedMultiplier: (speed: number) => void;
}

export const useStockStore = create<StockStoreState>()(
  immer((set, get) => ({
    stocks: [],
    stockMap: new Map(),
    isInitialized: false,
    tickFlashes: {},
    watchlist: ["RELIANCE", "TCS", "HDFCBANK", "INFY"], // Initial popular stocks
    savedScreeners: [],

    searchQuery: "",
    logicalOperator: "AND",
    activeRules: [],
    selectedPresetId: null,

    selectedStock: null,
    isChartModalOpen: false,

    isStreamActive: true,
    speedMultiplier: 1,

    toggleWatchlist: (ticker) => {
      set((state) => {
        const index = state.watchlist.indexOf(ticker);
        if (index > -1) {
          state.watchlist.splice(index, 1);
        } else {
          state.watchlist.push(ticker);
        }
      });
    },

    saveCurrentScreener: (name) => {
      const state = get();
      if (state.activeRules.length === 0) return;

      const newScreener: SavedScreener = {
        id: `saved_${Date.now()}`,
        name: name.trim() || `Strategy ${state.savedScreeners.length + 1}`,
        createdAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        rules: JSON.parse(JSON.stringify(state.activeRules)),
        logicalOperator: state.logicalOperator,
      };

      set((s) => {
        s.savedScreeners.unshift(newScreener);
      });
    },

    loadSavedScreener: (screener) => {
      set((state) => {
        state.logicalOperator = screener.logicalOperator;
        state.activeRules = JSON.parse(JSON.stringify(screener.rules));
        state.selectedPresetId = null;
      });
    },

    deleteSavedScreener: (id) => {
      set((state) => {
        state.savedScreeners = state.savedScreeners.filter((s) => s.id !== id);
      });
    },

    setStocks: (newStocks) => {
      const map = new Map<string, number>();
      newStocks.forEach((s, idx) => {
        map.set(s.ticker, idx);
      });
      set((state) => {
        state.stocks = newStocks;
        state.stockMap = map;
        state.isInitialized = true;
      });
    },

    applyBatchTicks: (ticks) => {
      set((state) => {
        const flashes = { ...state.tickFlashes };

        for (let i = 0; i < ticks.length; i++) {
          const tick = ticks[i];
          const stockIndex = state.stockMap.get(tick.ticker);
          if (stockIndex === undefined) continue;

          const stock = state.stocks[stockIndex];
          if (!stock) continue;

          const oldLtp = stock.ltp;
          const isUp = tick.ltp > oldLtp;
          const isDown = tick.ltp < oldLtp;

          if (isUp) flashes[tick.ticker] = "green";
          else if (isDown) flashes[tick.ticker] = "red";

          // Update stock properties in place
          stock.ltp = tick.ltp;
          stock.change = tick.change;
          stock.changePercent = tick.changePercent;
          stock.high = tick.high;
          stock.low = tick.low;
          stock.volume = tick.volume;

          // Update sparkline tail
          if (stock.sparkline && stock.sparkline.length > 0) {
            stock.sparkline[stock.sparkline.length - 1] = tick.ltp;
          }

          // If this stock is currently selected in the chart modal, update it too
          if (state.selectedStock && state.selectedStock.ticker === tick.ticker) {
            state.selectedStock.ltp = tick.ltp;
            state.selectedStock.change = tick.change;
            state.selectedStock.changePercent = tick.changePercent;
            state.selectedStock.high = tick.high;
            state.selectedStock.low = tick.low;
            state.selectedStock.volume = tick.volume;
          }
        }

        state.tickFlashes = flashes;
      });
    },

    clearFlash: (ticker) => {
      set((state) => {
        if (state.tickFlashes[ticker]) {
          delete state.tickFlashes[ticker];
        }
      });
    },

    setSearchQuery: (q) => {
      set((state) => {
        state.searchQuery = q;
      });
    },

    setLogicalOperator: (op) => {
      set((state) => {
        state.logicalOperator = op;
        state.selectedPresetId = null;
      });
    },

    addRule: (rule) => {
      set((state) => {
        state.activeRules.push(rule);
        state.selectedPresetId = null;
      });
    },

    removeRule: (id) => {
      set((state) => {
        state.activeRules = state.activeRules.filter((r) => r.id !== id);
        state.selectedPresetId = null;
      });
    },

    updateRule: (id, updates) => {
      set((state) => {
        const rule = state.activeRules.find((r) => r.id === id);
        if (rule) {
          Object.assign(rule, updates);
        }
        state.selectedPresetId = null;
      });
    },

    resetFilters: () => {
      set((state) => {
        state.searchQuery = "";
        state.logicalOperator = "AND";
        state.activeRules = [];
        state.selectedPresetId = null;
      });
    },

    applyPreset: (presetId) => {
      const preset = SCREENER_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      const formattedRules: ActiveFilterRule[] = preset.rules.map((r, i) => ({
        ...r,
        id: `preset_rule_${Date.now()}_${i}`,
      }));

      set((state) => {
        state.selectedPresetId = preset.id;
        state.logicalOperator = preset.logicalOperator;
        state.activeRules = formattedRules;
      });
    },

    setSelectedStock: (stock) => {
      set((state) => {
        state.selectedStock = stock;
      });
    },

    setChartModalOpen: (open) => {
      set((state) => {
        state.isChartModalOpen = open;
      });
    },

    setStreamActive: (active) => {
      set((state) => {
        state.isStreamActive = active;
      });
    },

    setSpeedMultiplier: (speed) => {
      set((state) => {
        state.speedMultiplier = speed;
      });
    },
  }))
);
