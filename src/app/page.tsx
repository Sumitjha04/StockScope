"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStockStore } from "@/store/useStockStore";
import { useBenchmarkStore } from "@/store/useBenchmarkStore";
import { useFpsCounter } from "@/hooks/useFpsCounter";
import { useWebSocketStream } from "@/hooks/useWebSocketStream";
import { executeFilterEngine } from "@/lib/filterEngine";
import { Header } from "@/components/layout/Header";
import { BenchmarkHud } from "@/components/layout/BenchmarkHud";
import { ProjectDefenseModal } from "@/components/layout/ProjectDefenseModal";
import { FilterPanel } from "@/components/screener/FilterPanel";
import { VirtualStockGrid } from "@/components/screener/VirtualStockGrid";
import { MarketHeatmap } from "@/components/screener/MarketHeatmap";
import { CandlestickModal } from "@/components/chart/CandlestickModal";
import { Loader2, AlertCircle, LayoutGrid, Table, Star } from "lucide-react";

export default function ScreenerPage() {
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "heatmap" | "watchlist">("grid");

  // Zustand Store
  const stocks = useStockStore((state) => state.stocks);
  const setStocks = useStockStore((state) => state.setStocks);
  const isInitialized = useStockStore((state) => state.isInitialized);
  const searchQuery = useStockStore((state) => state.searchQuery);
  const logicalOperator = useStockStore((state) => state.logicalOperator);
  const activeRules = useStockStore((state) => state.activeRules);
  const watchlist = useStockStore((state) => state.watchlist);

  const selectedStock = useStockStore((state) => state.selectedStock);
  const isChartModalOpen = useStockStore((state) => state.isChartModalOpen);
  const setChartModalOpen = useStockStore((state) => state.setChartModalOpen);

  const setFilterTime = useBenchmarkStore((state) => state.setFilterTime);
  const setCounts = useBenchmarkStore((state) => state.setCounts);

  // Initialize Live Hooks
  useFpsCounter();
  useWebSocketStream();

  // Fetch initial 5,200 stocks via TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["stocksUniverse"],
    queryFn: async () => {
      const res = await fetch("/api/stocks");
      if (!res.ok) throw new Error("Failed to load stock universe");
      return res.json();
    },
  });

  useEffect(() => {
    if (data && data.stocks && !isInitialized) {
      setStocks(data.stocks);
    }
  }, [data, isInitialized, setStocks]);

  // Execute Filter Engine over the 5,000+ stocks
  const { results: filteredStocks, filterTimeMs } = useMemo(() => {
    if (!stocks || stocks.length === 0) return { results: [], filterTimeMs: 0 };
    return executeFilterEngine(stocks, activeRules, logicalOperator, searchQuery);
  }, [stocks, activeRules, logicalOperator, searchQuery]);

  // Watchlist filtered universe
  const watchlistStocks = useMemo(() => {
    return filteredStocks.filter((s) => watchlist.includes(s.ticker));
  }, [filteredStocks, watchlist]);

  // Update Benchmark store metrics whenever filtering completes
  useEffect(() => {
    if (stocks.length > 0) {
      setFilterTime(filterTimeMs);
      setCounts(stocks.length, filteredStocks.length);
    }
  }, [filterTimeMs, stocks.length, filteredStocks.length, setFilterTime, setCounts]);

  if (isLoading && !isInitialized) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center text-slate-600 space-y-3">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <div className="text-center">
          <h2 className="text-sm font-semibold text-slate-900 font-mono">LOADING STOCK UNIVERSE</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generating 5,200 securities with historical OHLCV data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center text-rose-700 p-6 text-center">
        <AlertCircle className="w-10 h-10 mb-2 text-rose-600" />
        <h2 className="text-base font-bold text-slate-900">Failed to load market data</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          {(error as Error).message}. Please refresh the page to restart the market feed.
        </p>
      </div>
    );
  }

  const activeDisplayStocks = viewMode === "watchlist" ? watchlistStocks : filteredStocks;

  return (
    <main className="w-full h-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
      {/* 1. Header with Ticker Tape, Live Controls, Defense Button */}
      <Header onOpenDefenseModal={() => setIsDefenseModalOpen(true)} />

      {/* 2. Benchmark HUD displaying live targets vs measured profiler values */}
      <BenchmarkHud />

      {/* 3. Filter Controls: Presets, AND/OR logic, 30+ criteria builder, Search, Export */}
      <FilterPanel filteredStocks={filteredStocks} />

      {/* View Mode Bar: Virtual Grid vs Heatmap vs Watchlist */}
      <div className="w-full bg-slate-50 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "grid"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Virtual Grid</span>
          </button>
          <button
            onClick={() => setViewMode("heatmap")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "heatmap"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Market Heatmap</span>
          </button>
          <button
            onClick={() => setViewMode("watchlist")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "watchlist"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Showing <span className="text-slate-900 font-bold">{activeDisplayStocks.length.toLocaleString()}</span> of {stocks.length.toLocaleString()} securities
        </div>
      </div>

      {/* 4. Active View */}
      {viewMode === "grid" || viewMode === "watchlist" ? (
        <VirtualStockGrid stocks={activeDisplayStocks} />
      ) : (
        <MarketHeatmap stocks={filteredStocks} />
      )}

      {/* 5. TradingView Lightweight Charts Candlestick Modal with 5 Technical Indicators */}
      <CandlestickModal
        stock={selectedStock}
        isOpen={isChartModalOpen}
        onClose={() => setChartModalOpen(false)}
      />

      {/* 6. Academic Project Defense & Architecture Presentation Modal */}
      <ProjectDefenseModal
        isOpen={isDefenseModalOpen}
        onClose={() => setIsDefenseModalOpen(false)}
      />
    </main>
  );
}
