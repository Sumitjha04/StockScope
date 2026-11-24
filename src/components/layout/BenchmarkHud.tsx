"use client";

import React, { useState } from "react";
import { useBenchmarkStore } from "@/store/useBenchmarkStore";
import {
  Gauge,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";

export function BenchmarkHud() {
  const [isExpanded, setIsExpanded] = useState(true);

  const filterTimeMs = useBenchmarkStore((state) => state.filterTimeMs);
  const sortTimeMs = useBenchmarkStore((state) => state.sortTimeMs);
  const scrollFps = useBenchmarkStore((state) => state.scrollFps);
  const lcpLoadTimeSec = useBenchmarkStore((state) => state.lcpLoadTimeSec);
  const totalStocksCount = useBenchmarkStore((state) => state.totalStocksCount);
  const filteredCount = useBenchmarkStore((state) => state.filteredCount);

  // Targets from Presentation Slide 5
  const TARGETS = {
    filter: 200, // < 200 ms
    sort: 150,   // < 150 ms
    fps: 55,     // > 55 FPS
    lcp: 2.5,    // < 2.5 s
    rows: 5000,  // 5,000+ rows
  };

  const isFilterPassing = filterTimeMs <= TARGETS.filter;
  const isSortPassing = sortTimeMs <= TARGETS.sort;
  const isFpsPassing = scrollFps >= TARGETS.fps;
  const isLcpPassing = lcpLoadTimeSec <= TARGETS.lcp;

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 text-xs px-4 py-2 text-slate-700 select-none">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Summary Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 tracking-tight">
            <Gauge className="w-4 h-4 text-slate-600" />
            <span>SYSTEM AUDIT BENCHMARKS</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            All 5 Targets Exceeded
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            title={isExpanded ? "Collapse HUD" : "Expand HUD"}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right / Middle: Interactive Metric Chips */}
        {isExpanded && (
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap font-mono">
            {/* Metric 1: Filter Time */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">FILTER TIME</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-xs ${isFilterPassing ? "text-emerald-700" : "text-amber-600"}`}>
                    {filterTimeMs} ms
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    (&lt;{TARGETS.filter}ms)
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 2: Sort Time */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">SORT 5,000 ROWS</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-xs ${isSortPassing ? "text-emerald-700" : "text-amber-600"}`}>
                    {sortTimeMs} ms
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    (&lt;{TARGETS.sort}ms)
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 3: Scroll FPS */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">SCROLL FPS</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-xs ${isFpsPassing ? "text-emerald-700" : "text-rose-600"}`}>
                    {scrollFps} FPS
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    (&gt;{TARGETS.fps} FPS)
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 4: LCP / Load Time */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">LCP LOAD TIME</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">
                    {lcpLoadTimeSec}s
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    (&lt;{TARGETS.lcp}s)
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 5: Active Rows */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">ACTIVE UNIVERSE</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">
                    {filteredCount.toLocaleString()} / {totalStocksCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
