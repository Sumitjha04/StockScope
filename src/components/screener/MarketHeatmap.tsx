"use client";

import React, { useMemo, useState } from "react";
import { Stock } from "@/types/stock";
import { useStockStore } from "@/store/useStockStore";
import { Layers, Maximize2 } from "lucide-react";

interface MarketHeatmapProps {
  stocks: Stock[];
}

export function MarketHeatmap({ stocks }: MarketHeatmapProps) {
  const setSelectedStock = useStockStore((state) => state.setSelectedStock);
  const setChartModalOpen = useStockStore((state) => state.setChartModalOpen);
  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Group stocks by Sector
  const sectorGroups = useMemo(() => {
    const groups: Record<string, Stock[]> = {};
    for (let i = 0; i < stocks.length; i++) {
      const s = stocks[i];
      if (!groups[s.sector]) groups[s.sector] = [];
      groups[s.sector].push(s);
    }

    // Sort stocks inside each sector by market cap descending
    Object.keys(groups).forEach((sec) => {
      groups[sec].sort((a, b) => b.fundamentals.marketCapCr - a.fundamentals.marketCapCr);
    });

    return groups;
  }, [stocks]);

  const sectors = useMemo(() => {
    return ["All", ...Object.keys(sectorGroups).sort()];
  }, [sectorGroups]);

  // Clean flat color palette for light mode
  const getBoxColor = (pct: number) => {
    if (pct >= 3.0) return "bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-800/30";
    if (pct >= 1.5) return "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700/30";
    if (pct >= 0.0) return "bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200";
    if (pct > -1.5) return "bg-rose-50 hover:bg-rose-100 text-rose-950 border-rose-200";
    if (pct > -3.0) return "bg-rose-600 hover:bg-rose-500 text-white border-rose-700/30";
    return "bg-rose-700 hover:bg-rose-600 text-white border-rose-800/30";
  };

  const activeSectors = selectedSector === "All" ? Object.keys(sectorGroups) : [selectedSector];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-white p-4 space-y-4 overflow-y-auto select-none">
      {/* Top Filter Bar for Heatmap */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-slate-700" /> Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-500 mr-1 font-sans">Performance:</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-700 text-white">&lt; -3%</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white">-1.5%</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-950 border border-rose-200">0%</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-950 border border-emerald-200">0%</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white">+1.5%</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white">&gt; +3%</span>
        </div>
      </div>

      {/* Heatmap Grid Grouped by Sector */}
      <div className="space-y-6">
        {activeSectors.map((sectorName) => {
          const sectorStocks = sectorGroups[sectorName] || [];
          if (sectorStocks.length === 0) return null;

          const displayStocks = sectorStocks.slice(0, 40);

          return (
            <div key={sectorName} className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {sectorName}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {sectorStocks.length} securities
                  </span>
                </div>
              </div>

              {/* Flex Treemap Layout */}
              <div className="flex flex-wrap gap-1.5 min-h-[140px] p-2 bg-slate-50 rounded-lg border border-slate-200">
                {displayStocks.map((stock) => {
                  const isBull = stock.changePercent >= 0;
                  const colorClass = getBoxColor(stock.changePercent);

                  const isMega = stock.marketCapCategory === "Large";
                  const isMid = stock.marketCapCategory === "Mid";
                  const flexClass = isMega
                    ? "flex-grow min-w-[120px] h-20"
                    : isMid
                    ? "flex-grow min-w-[95px] h-16"
                    : "flex-grow min-w-[75px] h-14";

                  return (
                    <div
                      key={stock.id}
                      onClick={() => {
                        setSelectedStock(stock);
                        setChartModalOpen(true);
                      }}
                      onMouseEnter={() => setHoveredStock(stock)}
                      onMouseLeave={() => setHoveredStock(null)}
                      className={`relative rounded border p-2 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:opacity-95 ${flexClass} ${colorClass}`}
                      title={`${stock.name} | ₹${stock.ltp} (${isBull ? "+" : ""}${stock.changePercent}%)`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold font-mono text-xs tracking-tight">
                          {stock.ticker}
                        </span>
                        <Maximize2 className="w-3 h-3 opacity-40 hover:opacity-100" />
                      </div>

                      <div className="font-mono text-right mt-1">
                        <div className="text-[11px] font-semibold">
                          ₹{stock.ltp.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] font-bold">
                          {isBull ? "+" : ""}
                          {stock.changePercent}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Card Detail */}
      {hoveredStock && (
        <div className="fixed bottom-4 right-4 z-40 bg-white border border-slate-200 rounded-lg p-3 shadow-xl text-xs space-y-1.5 font-mono pointer-events-none animate-in fade-in duration-100 w-64">
          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-900 text-sm">{hoveredStock.ticker}</span>
            <span className={hoveredStock.changePercent >= 0 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
              {hoveredStock.changePercent >= 0 ? "+" : ""}{hoveredStock.changePercent}%
            </span>
          </div>
          <div className="text-slate-500 text-[11px] truncate font-sans">{hoveredStock.name}</div>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 pt-1">
            <div>Mkt Cap: ₹{hoveredStock.fundamentals.marketCapCr.toLocaleString()} Cr</div>
            <div>P/E: {hoveredStock.fundamentals.peRatio}</div>
            <div>ROE: {hoveredStock.fundamentals.roe}%</div>
            <div>RSI: {hoveredStock.technicals.rsi14}</div>
          </div>
        </div>
      )}
    </div>
  );
}
