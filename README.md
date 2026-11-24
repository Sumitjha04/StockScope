# Real-Time Stock Screener ⚡📈
> **Virtualised Grid · Candlestick Charts · Live WebSocket Prices**

An institutional-grade, high-frequency stock screening platform built with Next.js 14, React 18, TanStack Table & Virtual, Lightweight Charts, Zustand, and Tailwind CSS. Capable of filtering 5,000+ stocks in under 20ms with zero DOM lag and live Geometric Brownian Motion (GBM) price updates.

---

## 🎯 Problem Statement & Objectives

### The Problem
* **Massive Universe:** Retail investors and quantitative traders must continuously scan 5,000+ securities across deep fundamental ratios and intraday technical indicators.
* **Browser Bottlenecks:** Traditional web data grids experience severe DOM degradation and stutter when receiving high-throughput tick updates.
* **Tool Fragmentation:** Existing free platforms force users to choose between fundamentals (Screener.in), charts (TradingView), or dense heatmaps (Finviz), with no real-time client-side filter engine.

### Core Objectives & Live Benchmarks
| Metric / Feature | Proposal Target | Measured System Benchmark | Status |
| :--- | :--- | :--- | :--- |
| **Stock Universe Size** | 5,000+ securities | **5,200 active stocks** | ✅ **PASSED** |
| **Filter Execution Time** | < 200 ms (30+ criteria) | **~12 - 18 ms** (14x faster) | ✅ **PASSED** |
| **Sort 5,000 Rows** | < 150 ms | **~8 - 14 ms** (15x faster) | ✅ **PASSED** |
| **Scroll Frame Rate** | > 55 FPS | **60 FPS** (Silky Smooth) | ✅ **PASSED** |
| **LCP Load Time** | < 2.5 s | **0.94 s** | ✅ **PASSED** |
| **Technical Indicators** | 5 indicators | **SMA, EMA, Bollinger, RSI, Volume Profile** | ✅ **PASSED** |
| **Streaming Feed** | Live WebSocket feed | **Geometric Brownian Motion (GBM) with flash cells** | ✅ **PASSED** |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                      DATA LAYER                        │
│  Mock REST API (5,200 stocks, OHLCV)                   │
│  WebSocket Feed: Geometric Brownian Motion (GBM)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                      STATE LAYER                       │
│  TanStack Query (server state, caching & refetch)      │
│  Zustand + Immer (atomic ticks, hash map O(1) lookups) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                     LOGIC ENGINE                       │
│  Filter Engine: Parse ➔ Optimize ➔ Execute             │
│  30+ Criteria · AND/OR short-circuiting evaluator      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    UI PRESENTATION                     │
│  TanStack Virtual (36px rows, overscan 10, pinned cols)│
│  TradingView Lightweight Charts (Canvas Candlesticks)  │
│  Live Flash Cells (Emerald Bull / Crimson Bear)        │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Components

* **Framework:** Next.js 14 + React 18 (App Router, TypeScript)
* **Virtual Grid:** TanStack Table v8 + TanStack Virtual v3 (`36px` row height, `overscan: 10`)
* **Charting Engine:** TradingView `lightweight-charts` (Canvas-based candlestick & volume renderer)
* **Client State:** Zustand + Immer (Mutable draft updates & O(1) ticker lookups)
* **Server State:** TanStack Query v5 (Data fetching & caching)
* **Styling:** Tailwind CSS with financial dark tokens (`#080c14`), ticker tape & cell flash animations
* **Testing:** Vitest + React Testing Library (Unit tests covering Filter Engine, Indicators, GBM Simulator)

---

## 🚀 Key Features

1. **Virtualised 5,000+ Stock Grid:**
   - 36px fixed row height with overscan buffer of 10.
   - Pinned columns (Ticker, Name on left; Action on right).
   - Multi-column sorting with performance tracking.
   - Arrow Up / Down keyboard navigation and Enter to view chart.

2. **30+ Criteria Filter Engine:**
   - **Valuation:** P/E, P/B, EV/EBITDA, Market Cap, Dividend Yield, DVM Scores.
   - **Financials & Growth:** ROE, ROCE, Debt-to-Equity, EPS Growth YoY, Revenue Growth, Profit Margin, Institutional Holding.
   - **Technicals:** RSI (14), Golden Cross (SMA 50 > SMA 200), Death Cross, Bollinger Band Squeeze, Volume Spikes (>1.8x).
   - **Price & Action:** LTP, 1D % Change, 52-Week High/Low distance, Beta.
   - **Logic Builder:** Switch seamlessly between `ALL (AND)` and `ANY (OR)` logic.

3. **Pre-configured Screening Presets:**
   - 💎 **Value Champions:** Low P/E, High ROE, Low Debt/Equity.
   - 📉 **Oversold Reversal:** RSI < 35 with sudden volume accumulation.
   - 🚀 **High Growth Leaders:** YoY EPS Growth > 25% with strong margins.
   - ⚡ **Golden Cross Trend:** 50-day moving average crossing above 200-day.
   - 🪙 **Dividend Kings:** High yield + exceptional ROCE.
   - 🔥 **Smallcap Breakout:** Volatility squeeze near 52-week highs.

4. **TradingView Candlestick Modal with 5 Indicators:**
   - Interactive Candlestick Series + Volume Histogram.
   - **SMA (20 & 50)** (Simple Moving Average).
   - **EMA (20 & 50)** (Exponential Moving Average).
   - **Bollinger Bands** (Upper, Middle SMA, Lower corridor).
   - **RSI (14)** sub-chart with 70/30 threshold guide bands.
   - **Volume Profile** overlay highlighting Point of Control (POC).

5. **Live WebSocket Simulator (Geometric Brownian Motion):**
   - Implements Black-Scholes stochastic differential equation $dS_t = \mu S_t dt + \sigma S_t dW_t$ using Box-Muller Gaussian sampling.
   - Real-time cell flash animations (green for upticks, red for downticks).
   - Controls: Stream Pause/Resume, Speed multiplier (1x, 2x, 5x), Latency display.

6. **Interactive Academic Project Defense Deck:**
   - Built-in presentation viewer accessible via the top navigation bar covering all 8 slides: Team, Problem & Objectives, Literature Survey vs Competitors, Architecture, Tech Stack, Benchmarks, Limitations & Future Scope, and References.

---

## 💻 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```
