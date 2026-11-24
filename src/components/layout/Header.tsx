"use client";

import React from "react";
import { useStockStore } from "@/store/useStockStore";
import { useBenchmarkStore } from "@/store/useBenchmarkStore";
import {
  Activity,
  Play,
  Pause,
  GraduationCap,
  Radio,
  Clock,
  TrendingUp,
} from "lucide-react";

interface HeaderProps {
  onOpenDefenseModal: () => void;
}

export function Header({ onOpenDefenseModal }: HeaderProps) {
  const stocks = useStockStore((state) => state.stocks);
  const isStreamActive = useStockStore((state) => state.isStreamActive);
  const speedMultiplier = useStockStore((state) => state.speedMultiplier);
  const setStreamActive = useStockStore((state) => state.setStreamActive);
  const setSpeedMultiplier = useStockStore((state) => state.setSpeedMultiplier);

  const socketStatus = useBenchmarkStore((state) => state.socketStatus);
  const latencyMs = useBenchmarkStore((state) => state.latencyMs);
  const ticksPerSecond = useBenchmarkStore((state) => state.ticksPerSecond);

  // Top tickers for ticker tape
  const topMovers = stocks.slice(0, 10);

  return (
    <header className="w-full bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 select-none shadow-sm">
      {/* Top Ticker Tape */}
      <div className="w-full bg-slate-50/80 border-b border-slate-200/70 px-4 py-1.5 overflow-hidden flex items-center text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider pr-3 border-r border-slate-200 shrink-0">
          <Activity className="w-3.5 h-3.5 text-slate-700" />
          <span>MARKET TAPE</span>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pl-4 whitespace-nowrap animate-marquee">
          {topMovers.map((s) => {
            const isBull = s.changePercent >= 0;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{s.ticker}</span>
                <span className="text-slate-600">₹{s.ltp.toLocaleString("en-IN")}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isBull
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-rose-700 bg-rose-50 border border-rose-200"
                  }`}
                >
                  {isBull ? "+" : ""}
                  {s.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-[1920px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span>QuantPulse Screener</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  v2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Virtualised grid · Candlestick charts · Live WebSocket prices
            </p>
          </div>
        </div>

        {/* Live Controls & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  socketStatus === "connected"
                    ? "bg-emerald-500 ring-2 ring-emerald-100"
                    : socketStatus === "paused"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              <span className="font-medium text-slate-700">
                {socketStatus === "connected" ? "Live Feed" : socketStatus}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-500 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{latencyMs}ms</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-slate-600 font-mono">
              <span className="font-bold text-slate-800">{ticksPerSecond}</span> ticks/s
            </div>
          </div>

          {/* Stream Pause / Play Toggle */}
          <button
            onClick={() => setStreamActive(!isStreamActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isStreamActive
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                : "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            {isStreamActive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-500" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume Feed</span>
              </>
            )}
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md p-0.5 text-xs font-mono">
            {[1, 2, 5].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => setSpeedMultiplier(multiplier)}
                className={`px-2 py-0.5 rounded transition-all ${
                  speedMultiplier === multiplier
                    ? "bg-white text-slate-900 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {multiplier}x
              </button>
            ))}
          </div>

          {/* Project Defense / Academic Slide Deck Modal Button */}
          <button
            onClick={onOpenDefenseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
            <span>Project Defense & Slides</span>
          </button>
        </div>
      </div>
    </header>
  );
}
