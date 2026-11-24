"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";
import { Stock } from "@/types/stock";
import { generateCandlestickHistory } from "@/lib/stockGenerator";
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateVolumeProfile,
  VolumeBin,
} from "@/lib/indicators";
import {
  X,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Activity,
  Sliders,
} from "lucide-react";

interface CandlestickModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandlestickModal({ stock, isOpen, onClose }: CandlestickModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);

  // Indicator Toggles
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolumeProfile, setShowVolumeProfile] = useState(true);

  // Timeframe
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("6M");
  const [volumeBins, setVolumeBins] = useState<VolumeBin[]>([]);

  useEffect(() => {
    if (!isOpen || !stock || !chartContainerRef.current) return;

    // 1. Generate historical candles based on timeframe
    const days = timeframe === "1M" ? 30 : timeframe === "3M" ? 90 : timeframe === "6M" ? 180 : 365;
    const candles = generateCandlestickHistory(stock, days);

    // Calculate Volume Profile
    const vBins = calculateVolumeProfile(candles, 20);
    setVolumeBins(vBins);

    // 2. Initialize Main Chart with clean minimalist white background
    const mainChart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#64748b",
      },
      grid: {
        vertLines: { color: "#f1f5f9" },
        horzLines: { color: "#f1f5f9" },
      },
      crosshair: {
        vertLine: { color: "#94a3b8", width: 1, style: 3 },
        horzLine: { color: "#94a3b8", width: 1, style: 3 },
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
      },
      timeScale: {
        borderColor: "#e2e8f0",
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });
    chartRef.current = mainChart;

    // 3. Add Candlestick Series
    const candleSeries = mainChart.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    const candleData = candles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(candleData);

    // 4. Add Volume Histogram
    const volumeSeries = mainChart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "", // overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? "rgba(22, 163, 74, 0.2)" : "rgba(220, 38, 38, 0.2)",
      }))
    );

    const closePrices = candles.map((c) => c.close);

    // 5. SMA Series (20 & 50)
    if (showSMA) {
      const sma20 = calculateSMA(closePrices, 20);
      const sma50 = calculateSMA(closePrices, 50);

      const sma20Series = mainChart.addLineSeries({
        color: "#2563eb",
        lineWidth: 2,
        title: "SMA 20",
      });
      const sma20Data = candles
        .map((c, i) => (sma20[i] !== null ? { time: c.time, value: sma20[i]! } : null))
        .filter(Boolean) as any[];
      sma20Series.setData(sma20Data);

      const sma50Series = mainChart.addLineSeries({
        color: "#d97706",
        lineWidth: 2,
        title: "SMA 50",
      });
      const sma50Data = candles
        .map((c, i) => (sma50[i] !== null ? { time: c.time, value: sma50[i]! } : null))
        .filter(Boolean) as any[];
      sma50Series.setData(sma50Data);
    }

    // 6. EMA Series (20 & 50)
    if (showEMA) {
      const ema20 = calculateEMA(closePrices, 20);
      const ema50 = calculateEMA(closePrices, 50);

      const ema20Series = mainChart.addLineSeries({
        color: "#7c3aed",
        lineWidth: 2,
        title: "EMA 20",
      });
      const ema20Data = candles
        .map((c, i) => (ema20[i] !== null ? { time: c.time, value: ema20[i]! } : null))
        .filter(Boolean) as any[];
      ema20Series.setData(ema20Data);

      const ema50Series = mainChart.addLineSeries({
        color: "#0891b2",
        lineWidth: 2,
        title: "EMA 50",
      });
      const ema50Data = candles
        .map((c, i) => (ema50[i] !== null ? { time: c.time, value: ema50[i]! } : null))
        .filter(Boolean) as any[];
      ema50Series.setData(ema50Data);
    }

    // 7. Bollinger Bands
    if (showBollinger) {
      const bb = calculateBollingerBands(closePrices, 20, 2);

      const bbUpperSeries = mainChart.addLineSeries({
        color: "#94a3b8",
        lineWidth: 1,
        title: "BB Upper",
      });
      const bbLowerSeries = mainChart.addLineSeries({
        color: "#94a3b8",
        lineWidth: 1,
        title: "BB Lower",
      });

      const upperData = candles
        .map((c, i) => (bb[i].upper !== null ? { time: c.time, value: bb[i].upper! } : null))
        .filter(Boolean) as any[];
      const lowerData = candles
        .map((c, i) => (bb[i].lower !== null ? { time: c.time, value: bb[i].lower! } : null))
        .filter(Boolean) as any[];

      bbUpperSeries.setData(upperData);
      bbLowerSeries.setData(lowerData);
    }

    // 8. RSI Sub-chart
    if (showRSI && rsiContainerRef.current) {
      const rsiChart = createChart(rsiContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#ffffff" },
          textColor: "#64748b",
        },
        grid: {
          vertLines: { color: "#f1f5f9" },
          horzLines: { color: "#f1f5f9" },
        },
        rightPriceScale: {
          borderColor: "#e2e8f0",
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: {
          visible: false,
        },
        width: rsiContainerRef.current.clientWidth,
        height: 110,
      });
      rsiChartRef.current = rsiChart;

      const rsiValues = calculateRSI(closePrices, 14);
      const rsiSeries = rsiChart.addLineSeries({
        color: "#7c3aed",
        lineWidth: 2,
        title: "RSI (14)",
      });

      const rsiData = candles
        .map((c, i) => (rsiValues[i] !== null ? { time: c.time, value: rsiValues[i]! } : null))
        .filter(Boolean) as any[];
      rsiSeries.setData(rsiData);

      // Overbought / Oversold threshold guide lines
      const overboughtLine = rsiChart.addLineSeries({
        color: "rgba(220, 38, 38, 0.4)",
        lineWidth: 1,
        lineStyle: 2,
      });
      overboughtLine.setData(candles.map((c) => ({ time: c.time, value: 70 })));

      const oversoldLine = rsiChart.addLineSeries({
        color: "rgba(22, 163, 74, 0.4)",
        lineWidth: 1,
        lineStyle: 2,
      });
      oversoldLine.setData(candles.map((c) => ({ time: c.time, value: 30 })));
    }

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current && mainChart) {
        mainChart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
      if (rsiContainerRef.current && rsiChartRef.current) {
        rsiChartRef.current.applyOptions({ width: rsiContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mainChart.remove();
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
      }
    };
  }, [isOpen, stock, timeframe, showSMA, showEMA, showBollinger, showRSI]);

  if (!isOpen || !stock) return null;

  const isBull = stock.changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-6xl bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold font-mono text-xs">
              {stock.ticker.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">{stock.ticker}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  {stock.sector}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                  {stock.index}
                </span>
              </div>
              <p className="text-xs text-slate-500">{stock.name}</p>
            </div>
          </div>

          {/* Real-time Price Snapshot */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-slate-900">
                ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                  isBull ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {isBull ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isBull ? "+" : ""}
                  {stock.change} ({isBull ? "+" : ""}
                  {stock.changePercent}%)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe & Indicators */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 font-mono shadow-sm">
            {(["1M", "3M", "6M", "1Y"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  timeframe === tf
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-mono mr-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-600" /> Indicators:
            </span>

            {/* 1. SMA */}
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                showSMA
                  ? "bg-slate-900 border-slate-900 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              SMA (20/50)
            </button>

            {/* 2. EMA */}
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                showEMA
                  ? "bg-slate-900 border-slate-900 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              EMA (20/50)
            </button>

            {/* 3. Bollinger Bands */}
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                showBollinger
                  ? "bg-slate-900 border-slate-900 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Bollinger Bands
            </button>

            {/* 4. RSI */}
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                showRSI
                  ? "bg-slate-900 border-slate-900 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              RSI (14)
            </button>

            {/* 5. Volume Profile */}
            <button
              onClick={() => setShowVolumeProfile(!showVolumeProfile)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                showVolumeProfile
                  ? "bg-slate-900 border-slate-900 text-white font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Volume Profile
            </button>
          </div>
        </div>

        {/* Chart Body & Sidebar Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-50/50">
          {/* Main Candlestick Chart Area (Col Span 3) */}
          <div className="lg:col-span-3 space-y-3 flex flex-col">
            <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div ref={chartContainerRef} className="w-full" />

              {/* Volume Profile Overlay (Right side of chart canvas) */}
              {showVolumeProfile && volumeBins.length > 0 && (
                <div className="absolute right-14 top-4 bottom-12 w-28 pointer-events-none flex flex-col justify-between opacity-70">
                  {volumeBins.slice().reverse().map((bin, i) => {
                    const maxVol = Math.max(...volumeBins.map((b) => b.volume));
                    const widthPct = Math.round((bin.volume / maxVol) * 100);
                    return (
                      <div key={i} className="flex items-center justify-end h-2">
                        <div
                          style={{ width: `${widthPct}%` }}
                          className={`h-1.5 rounded-sm ${
                            bin.isPoc
                              ? "bg-amber-500"
                              : "bg-slate-300"
                          }`}
                          title={`Volume: ${bin.volume.toLocaleString()}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RSI Sub-Panel */}
            {showRSI && (
              <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 pb-1">
                  <span>Relative Strength Index (RSI 14)</span>
                  <span className="text-purple-700 font-bold">Current: {stock.technicals.rsi14}</span>
                </div>
                <div ref={rsiContainerRef} className="w-full" />
              </div>
            )}
          </div>

          {/* Deep Stock Metrics Sidebar (Col Span 1) */}
          <div className="space-y-3 text-xs">
            {/* Fundamental Card */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <BarChart2 className="w-4 h-4 text-slate-700" />
                <span>Fundamental Ratios</span>
              </div>
              <div className="space-y-2 font-mono text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Market Cap:</span>
                  <span className="text-slate-900 font-semibold">₹{stock.fundamentals.marketCapCr.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">P/E Ratio:</span>
                  <span className="text-slate-900 font-semibold">{stock.fundamentals.peRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">P/B Ratio:</span>
                  <span className="text-slate-900 font-semibold">{stock.fundamentals.pbRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ROE:</span>
                  <span className="text-emerald-700 font-semibold">{stock.fundamentals.roe}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ROCE:</span>
                  <span className="text-emerald-700 font-semibold">{stock.fundamentals.roce}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Div. Yield:</span>
                  <span className="text-slate-900 font-semibold">{stock.fundamentals.dividendYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Debt to Equity:</span>
                  <span className="text-slate-900 font-semibold">{stock.fundamentals.debtToEquity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institutional:</span>
                  <span className="text-slate-900 font-semibold">{stock.fundamentals.institutionalHolding}%</span>
                </div>
              </div>
            </div>

            {/* DVM Score Breakdown */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-700" />
                  <span>DVM Composite</span>
                </div>
                <span className="text-slate-900 font-mono font-bold text-sm">
                  {stock.fundamentals.dvmScore.composite}/100
                </span>
              </div>

              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Quality</span>
                    <span className="text-slate-800">{stock.fundamentals.dvmScore.quality}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${stock.fundamentals.dvmScore.quality}%` }} className="bg-emerald-600 h-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Valuation</span>
                    <span className="text-slate-800">{stock.fundamentals.dvmScore.valuation}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${stock.fundamentals.dvmScore.valuation}%` }} className="bg-blue-600 h-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Momentum</span>
                    <span className="text-slate-800">{stock.fundamentals.dvmScore.momentum}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${stock.fundamentals.dvmScore.momentum}%` }} className="bg-amber-500 h-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* 52-Week Range */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2 font-mono">
              <div className="text-slate-500 text-[11px] uppercase">52-Week Range</div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold">
                <span>Low: ₹{stock.week52Low}</span>
                <span>High: ₹{stock.week52High}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                <div
                  style={{
                    left: `${Math.max(
                      0,
                      Math.min(
                        100,
                        ((stock.ltp - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100
                      )
                    )}%`,
                  }}
                  className="absolute top-0 bottom-0 w-2 -ml-1 bg-slate-900 rounded"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>+{stock.distFrom52WLow}% from low</span>
                <span>{stock.distFrom52WHigh}% from high</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
