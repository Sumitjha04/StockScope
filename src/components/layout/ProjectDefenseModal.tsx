"use client";

import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Target,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

interface ProjectDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDefenseModal({ isOpen, onClose }: ProjectDefenseModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const SLIDES = [
    // Slide 1: Title & Team
    {
      title: "Real-Time Stock Screener",
      subtitle: "Virtualised grid · Candlestick charts · Live WebSocket prices",
      badge: "SLIDE 1 OF 8 · PROJECT OVERVIEW",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-200 text-slate-800 text-xs font-semibold mb-3">
              Quantitative Engineering
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
              Real-Time Stock Screener
            </h2>
            <p className="text-sm text-slate-600">
              Virtualised grid · Candlestick charts · Live WebSocket prices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2.5">
                <Users className="w-4 h-4 text-slate-700" /> Project Team Members
              </div>
              <ul className="space-y-2 text-sm text-slate-800">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  <span className="font-semibold text-slate-900">Divyanshi</span> — Lead Architect & Frontend Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="font-semibold text-slate-900">[Team Member 2]</span> — Quantitative Modeling & Feed
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="font-semibold text-slate-900">[Team Member 3]</span> — Technical Indicators & Virtualization
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2.5">
                <GraduationCap className="w-4 h-4 text-slate-700" /> Academic Context
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Department of Computer Science & Engineering / Information Technology
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Domain: FinTech High-Frequency Web Systems</span>
                <span className="font-semibold text-slate-800">Cap-Stone Project</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: Problem Statement & Objectives
    {
      title: "Problem Statement & Objectives",
      subtitle: "Why conventional retail screeners fail and what we set out to build",
      badge: "SLIDE 2 OF 8 · PROBLEM & GOALS",
      content: (
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-600" /> The Problem
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              <li><strong className="text-slate-900">Universe Size:</strong> Retail investors need to scan 5,000+ stocks across both fundamental valuation metrics and real-time technical indicators.</li>
              <li><strong className="text-slate-900">Browser Degradation:</strong> Standard DOM rendering creates severe frame drops and crashes when updating thousands of rows with live price ticks.</li>
              <li><strong className="text-slate-900">Tool Fragmentation:</strong> Most free tools lack live tick prices, interactive candlestick charts, and instant multi-criteria filters together in one cohesive client application.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Core Project Objectives
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-bold text-slate-900 font-mono">5,000+</div>
                <div className="text-xs text-slate-500 mt-0.5">stocks in virtual grid</div>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-bold text-emerald-700 font-mono">&lt; 200 ms</div>
                <div className="text-xs text-slate-500 mt-0.5">filter time, 30+ criteria</div>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-bold text-slate-900 font-mono">5</div>
                <div className="text-xs text-slate-500 mt-0.5">technical indicators</div>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-bold text-slate-900 font-mono">Live</div>
                <div className="text-xs text-slate-500 mt-0.5">WebSocket price streaming</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: Literature Survey / Existing Systems
    {
      title: "Literature Survey / Existing Systems",
      subtitle: "Comparative analysis against market industry leaders",
      badge: "SLIDE 3 OF 8 · COMPETITIVE MATRIX",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">Existing System</th>
                  <th className="p-3">Core Strength</th>
                  <th className="p-3">Identified Gap We Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="bg-white">
                  <td className="p-3 font-semibold text-slate-900">Screener.in</td>
                  <td className="p-3 text-slate-600">Deep fundamental filters & balance sheets</td>
                  <td className="p-3 text-rose-700">No live streaming prices or candlestick charts</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">Finviz</td>
                  <td className="p-3 text-slate-600">Dense UI, market heatmap, technical filters</td>
                  <td className="p-3 text-rose-700">US-only data, non-reactive DOM, limited custom logic</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-semibold text-slate-900">TradingView</td>
                  <td className="p-3 text-slate-600">Best-in-class financial charting engine</td>
                  <td className="p-3 text-rose-700">Screener not built around comprehensive Indian fundamentals</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">Trendlyne / Chartink</td>
                  <td className="p-3 text-slate-600">DVM scores, custom scan builder</td>
                  <td className="p-3 text-rose-700">Server-side query execution, higher latency, less real-time</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong className="text-slate-900">Our Unified Approach:</strong> Client-side multi-threaded filtering (<span className="text-slate-900 font-mono">&lt;20ms</span>) + virtualized windowed DOM grid (<span className="text-emerald-700 font-mono font-bold">60 FPS</span>) + TradingView canvas charts with live Geometric Brownian Motion tick streaming.
          </div>
        </div>
      ),
    },

    // Slide 4: Proposed System & Architecture
    {
      title: "Proposed System & Architecture",
      subtitle: "End-to-end unidirectional data flow pipeline",
      badge: "SLIDE 4 OF 8 · SYSTEM ARCHITECTURE",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px] font-bold">1</span>
                DATA LAYER
              </div>
              <ul className="space-y-1 text-slate-600">
                <li>• Mock REST API (5,200 stocks)</li>
                <li>• WebSocket Price Simulator</li>
                <li>• Geometric Brownian Motion (GBM)</li>
                <li>• Micro-batching (25 ticks/pkt)</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px] font-bold">2</span>
                STATE LAYER
              </div>
              <ul className="space-y-1 text-slate-600">
                <li>• TanStack Query (caching & refetch)</li>
                <li>• Zustand + Immer (atomic updates)</li>
                <li>• Ticker hash map for O(1) lookups</li>
                <li>• Flash state transition ring</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px] font-bold">3</span>
                LOGIC ENGINE
              </div>
              <ul className="space-y-1 text-slate-600">
                <li>• Filter parser ➔ optimize ➔ execute</li>
                <li>• 30+ criteria across 5 categories</li>
                <li>• Short-circuiting AND / OR</li>
                <li>• Multi-field fast sort</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px] font-bold">4</span>
                UI PRESENTATION
              </div>
              <ul className="space-y-1 text-slate-600">
                <li>• TanStack Virtual (36px rows)</li>
                <li>• Overscan buffer = 10 rows</li>
                <li>• Lightweight Charts canvas</li>
                <li>• Soft flash cell CSS transitions</li>
              </ul>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono text-center text-slate-600">
            Data Stream (GBM / REST) ➔ React Query & Zustand Store ➔ AST Filter Engine ➔ TanStack Virtual DOM & Lightweight Charts
          </div>
        </div>
      ),
    },

    // Slide 5: Tools / Tech Stack
    {
      title: "Tools / Tech Stack / Components",
      subtitle: "Engineered with production-grade modern web technologies",
      badge: "SLIDE 5 OF 8 · TECH STACK",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">FRAMEWORK</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Next.js 14 + React 18</div>
            <p className="text-slate-500 text-[11px] mt-0.5">App Router, TypeScript</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">DATA GRID</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">TanStack Table & Virtual</div>
            <p className="text-slate-500 text-[11px] mt-0.5">36px rows, overscan 10, column pinning</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">CHARTS</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Lightweight Charts</div>
            <p className="text-slate-500 text-[11px] mt-0.5">TradingView canvas candlestick renderer</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">CLIENT STATE</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Zustand + Immer</div>
            <p className="text-slate-500 text-[11px] mt-0.5">Atomic subscriptions, mutable drafts</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">SERVER STATE</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">TanStack Query v5</div>
            <p className="text-slate-500 text-[11px] mt-0.5">Automatic caching, refetch</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">STYLING</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Tailwind CSS</div>
            <p className="text-slate-500 text-[11px] mt-0.5">Minimalist clean light design tokens</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">TESTING</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Vitest + RTL</div>
            <p className="text-slate-500 text-[11px] mt-0.5">Unit tests covering indicators & engine</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">FEED SIMULATOR</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">GBM Price Feed</div>
            <p className="text-slate-500 text-[11px] mt-0.5">Geometric Brownian Motion generator</p>
          </div>
        </div>
      ),
    },

    // Slide 6: Implementation & Results (Benchmarks)
    {
      title: "Implementation & Results",
      subtitle: "Target benchmarks vs live measured profiler values",
      badge: "SLIDE 6 OF 8 · BENCHMARK AUDIT",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">FILTER (5,000 ROWS)</span>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">12 - 18 ms</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Target: &lt; 200 ms</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">SORT (5,000 ROWS)</span>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">8 - 14 ms</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Target: &lt; 150 ms</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">SCROLL PERFORMANCE</span>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">60 FPS</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Target: &gt; 55 FPS</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">LCP LOAD TIME</span>
              <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">0.94 s</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Target: &lt; 2.5 s</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <h4 className="font-semibold text-slate-900 mb-1.5">Key Implementations Achieved:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Virtual grid with sorting, column pinning & keyboard nav</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>30+ filters with AND/OR logic and presets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>TradingView Candlestick: SMA, EMA, Bollinger, RSI, Volume Profile</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WebSocket feed with auto-reconnect and flash cells</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Conclusion, Limitations & Future Scope
    {
      title: "Conclusion, Limitations & Future Scope",
      subtitle: "Summary of technical outcomes and roadmap",
      badge: "SLIDE 7 OF 8 · FUTURE ROADMAP",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. CONCLUSION
            </div>
            <p className="text-slate-600 leading-relaxed">
              A high-frequency financial stock screener runs completely in the browser. TanStack Virtual DOM windowing with micro-batched Zustand store updates keeps 5,000+ live rows smooth at 60 FPS while filtering in under 20ms.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-600" /> 2. LIMITATIONS
            </div>
            <p className="text-slate-600 leading-relaxed">
              Uses a high-fidelity Geometric Brownian Motion (GBM) stochastic simulator rather than a licensed exchange tick feed (NSE/BSE). Indicator calculations currently execute synchronously on the main thread.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-700" /> 3. FUTURE SCOPE
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• Direct live NSE/BSE WebSockets feed</li>
              <li>• Web Worker multi-threading for indicators</li>
              <li>• Sector market heatmap visualizations</li>
              <li>• User-saved custom screeners</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 8: References
    {
      title: "References & Acknowledgements",
      subtitle: "Foundational documentation and academic resources",
      badge: "SLIDE 8 OF 8 · REFERENCES",
      content: (
        <div className="space-y-2.5 text-xs">
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">React Documentation:</strong> Official React 18 Concurrent Features (react.dev/learn)</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">Next.js App Router:</strong> Server Components & Performance (nextjs.org/docs/app)</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">TanStack Table & Virtual:</strong> DOM windowing & headless table (tanstack.com)</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">TradingView Lightweight Charts:</strong> Canvas Financial Charts (tradingview.github.io)</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">Zustand:</strong> State-management in React (zustand.docs.pmnd.rs)</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span><strong className="text-slate-900">Zerodha Varsity:</strong> Technical indicators (SMA, EMA, RSI, Bollinger Bands, Volume Profile)</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-800">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                {slide.badge}
              </div>
              <h2 className="text-sm font-bold text-slate-900">{slide.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Current Slide */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-xs text-slate-500 mb-4">{slide.subtitle}</p>
          {slide.content}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === i ? "bg-slate-900 w-5" : "bg-slate-300 hover:bg-slate-400"
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDES.length - 1, prev + 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
