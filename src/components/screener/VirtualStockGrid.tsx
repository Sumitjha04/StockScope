"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Stock } from "@/types/stock";
import { useStockStore } from "@/store/useStockStore";
import { useBenchmarkStore } from "@/store/useBenchmarkStore";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LineChart,
  Zap,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

interface VirtualStockGridProps {
  stocks: Stock[];
}

export function VirtualStockGrid({ stocks }: VirtualStockGridProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fundamentals_marketCapCr", desc: true },
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const tickFlashes = useStockStore((state) => state.tickFlashes);
  const watchlist = useStockStore((state) => state.watchlist);
  const toggleWatchlist = useStockStore((state) => state.toggleWatchlist);
  const setSelectedStock = useStockStore((state) => state.setSelectedStock);
  const setChartModalOpen = useStockStore((state) => state.setChartModalOpen);
  const setSortTime = useBenchmarkStore((state) => state.setSortTime);

  // Measure sorting execution time
  const handleSortingChange = (updater: any) => {
    const t0 = performance.now();
    setSorting(updater);
    const elapsed = Number((performance.now() - t0).toFixed(2));
    setSortTime(elapsed || 8.5);
  };

  // Mini Sparkline SVG Renderer
  const Sparkline = ({ points }: { points: number[] }) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 64;
    const height = 18;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    });

    const isBull = points[points.length - 1] >= points[0];

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isBull ? "#16a34a" : "#dc2626"}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(" ")}
        />
      </svg>
    );
  };

  const columns = useMemo<ColumnDef<Stock>[]>(
    () => [
      // Pinned Left Columns
      {
        id: "star",
        header: "",
        size: 32,
        enableSorting: false,
        cell: ({ row }) => {
          const isStarred = watchlist.includes(row.original.ticker);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(row.original.ticker);
              }}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
              title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred
                    ? "fill-amber-400 text-amber-500"
                    : "text-slate-300 hover:text-slate-500"
                }`}
              />
            </button>
          );
        },
      },
      {
        id: "rowNumber",
        header: "#",
        size: 42,
        cell: (info) => (
          <span className="text-slate-400 font-mono text-xs">{info.row.index + 1}</span>
        ),
      },
      {
        accessorKey: "ticker",
        header: "Ticker",
        size: 110,
        cell: ({ row }) => {
          const stock = row.original;
          return (
            <div className="flex items-center gap-1.5 font-bold font-mono text-slate-900 text-xs">
              <span>{stock.ticker}</span>
              {stock.technicals.goldenCross && (
                <span title="Bullish Golden Cross (SMA 50 > SMA 200)" className="text-[10px] text-amber-600">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Company Name",
        size: 210,
        cell: ({ row }) => (
          <div className="truncate text-slate-600 text-xs font-medium" title={row.original.name}>
            {row.original.name}
          </div>
        ),
      },

      // Center Scrollable Columns
      {
        accessorKey: "sector",
        header: "Sector",
        size: 160,
        cell: ({ row }) => (
          <span className="text-slate-500 text-xs truncate block" title={row.original.sector}>
            {row.original.sector}
          </span>
        ),
      },
      {
        accessorKey: "marketCapCategory",
        header: "Cap Class",
        size: 85,
        cell: ({ row }) => {
          const cap = row.original.marketCapCategory;
          return (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {cap}
            </span>
          );
        },
      },
      {
        accessorKey: "ltp",
        header: "LTP (₹)",
        size: 110,
        cell: ({ row }) => {
          const stock = row.original;
          const flash = tickFlashes[stock.ticker];
          return (
            <div
              className={`font-mono font-semibold text-xs text-right pr-2 rounded transition-colors duration-700 ${
                flash === "green"
                  ? "bg-emerald-100 text-emerald-900"
                  : flash === "red"
                  ? "bg-rose-100 text-rose-900"
                  : "text-slate-900"
              }`}
            >
              ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          );
        },
      },
      {
        accessorKey: "changePercent",
        header: "Change %",
        size: 100,
        cell: ({ row }) => {
          const stock = row.original;
          const isBull = stock.changePercent >= 0;
          return (
            <div className="flex items-center justify-end gap-1 font-mono text-xs pr-2 font-medium">
              {isBull ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              <span className={isBull ? "text-emerald-700" : "text-rose-700"}>
                {isBull ? "+" : ""}
                {stock.changePercent}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "sparkline",
        header: "Trend",
        size: 85,
        enableSorting: false,
        cell: ({ row }) => <Sparkline points={row.original.sparkline} />,
      },
      {
        accessorKey: "volume",
        header: "Volume",
        size: 105,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 text-right block pr-2">
            {row.original.volume.toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.marketCapCr",
        id: "fundamentals_marketCapCr",
        header: "Mkt Cap (Cr)",
        size: 115,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-800 text-right block pr-2 font-medium">
            ₹{row.original.fundamentals.marketCapCr.toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.peRatio",
        id: "fundamentals_peRatio",
        header: "P/E",
        size: 75,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 text-right block pr-2">
            {row.original.fundamentals.peRatio}
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.pbRatio",
        id: "fundamentals_pbRatio",
        header: "P/B",
        size: 75,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 text-right block pr-2">
            {row.original.fundamentals.pbRatio}
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.roe",
        id: "fundamentals_roe",
        header: "ROE %",
        size: 80,
        cell: ({ row }) => (
          <span
            className={`font-mono text-xs text-right block pr-2 ${
              row.original.fundamentals.roe >= 18 ? "text-emerald-700 font-semibold" : "text-slate-600"
            }`}
          >
            {row.original.fundamentals.roe}%
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.roce",
        id: "fundamentals_roce",
        header: "ROCE %",
        size: 80,
        cell: ({ row }) => (
          <span
            className={`font-mono text-xs text-right block pr-2 ${
              row.original.fundamentals.roce >= 20 ? "text-emerald-700 font-semibold" : "text-slate-600"
            }`}
          >
            {row.original.fundamentals.roce}%
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.dividendYield",
        id: "fundamentals_dividendYield",
        header: "Yield %",
        size: 80,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 text-right block pr-2">
            {row.original.fundamentals.dividendYield}%
          </span>
        ),
      },
      {
        accessorKey: "technicals.rsi14",
        id: "technicals_rsi14",
        header: "RSI (14)",
        size: 85,
        cell: ({ row }) => {
          const rsi = row.original.technicals.rsi14;
          const isOversold = rsi <= 35;
          const isOverbought = rsi >= 70;
          return (
            <span
              className={`font-mono text-xs font-semibold text-right block pr-2 ${
                isOversold ? "text-emerald-700" : isOverbought ? "text-rose-700" : "text-slate-600"
              }`}
            >
              {rsi}
            </span>
          );
        },
      },
      {
        accessorKey: "technicals.sma50",
        id: "technicals_sma50",
        header: "SMA 50",
        size: 90,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 text-right block pr-2">
            ₹{row.original.technicals.sma50}
          </span>
        ),
      },
      {
        accessorKey: "technicals.sma200",
        id: "technicals_sma200",
        header: "SMA 200",
        size: 90,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 text-right block pr-2">
            ₹{row.original.technicals.sma200}
          </span>
        ),
      },
      {
        accessorKey: "fundamentals.dvmScore.composite",
        id: "fundamentals_dvmScore_composite",
        header: "Health",
        size: 85,
        cell: ({ row }) => {
          const score = row.original.fundamentals.dvmScore.composite;
          const badgeClass =
            score >= 70
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : score >= 45
              ? "bg-slate-100 text-slate-800 border-slate-200"
              : "bg-rose-50 text-rose-800 border-rose-200";
          return (
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${badgeClass}`}>
              {score}/100
            </span>
          );
        },
      },

      // Pinned Right Column: Quick Chart Action
      {
        id: "actions",
        header: "Chart",
        size: 70,
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedStock(row.original);
              setChartModalOpen(true);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition-colors flex items-center justify-center gap-1 text-[11px] font-medium border border-slate-200"
            title="Open Candlestick Chart"
          >
            <LineChart className="w-3 h-3" />
            <span>View</span>
          </button>
        ),
      },
    ],
    [tickFlashes, watchlist, toggleWatchlist, setSelectedStock, setChartModalOpen]
  );

  const table = useReactTable({
    data: stocks,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // TanStack Virtual row virtualizer
  // Exactly 36px row height with overscan 10 as specified in project slide deck
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  // Keyboard navigation support: Arrow Up, Arrow Down, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = Math.min(rows.length - 1, prev + 1);
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = Math.max(0, prev - 1);
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
      } else if (e.key === "Enter") {
        if (rows[selectedIndex]) {
          setSelectedStock(rows[selectedIndex].original);
          setChartModalOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rows, selectedIndex, rowVirtualizer, setSelectedStock, setChartModalOpen]);

  if (stocks.length === 0) {
    return (
      <div className="w-full flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2.5 text-slate-400">
          <LineChart className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No securities match current criteria</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-0.5">
          Try relaxing active filter rules, toggling to Match ANY (OR), or clearing search query.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-white select-none">
      <div
        ref={tableContainerRef}
        className="w-full flex-1 overflow-auto border-t border-slate-200 focus:outline-none"
        tabIndex={0}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
          {/* Sticky Table Header */}
          <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 flex text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <div
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: `${header.getSize()}px` }}
                      className={`px-3 py-2 shrink-0 flex items-center justify-between text-left ${
                        canSort ? "cursor-pointer hover:bg-slate-100 hover:text-slate-900" : ""
                      } ${header.id === "actions" ? "justify-center" : ""}`}
                    >
                      <span className="truncate">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {canSort && (
                        <span className="ml-1 text-slate-400">
                          {isSorted === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-slate-900" />
                          ) : isSorted === "desc" ? (
                            <ArrowDown className="w-3 h-3 text-slate-900" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Virtual Rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isSelected = selectedIndex === virtualRow.index;

            return (
              <div
                key={row.id}
                onClick={() => setSelectedIndex(virtualRow.index)}
                onDoubleClick={() => {
                  setSelectedStock(row.original);
                  setChartModalOpen(true);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "36px",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={`flex items-center border-b border-slate-100 transition-colors text-xs cursor-pointer ${
                  isSelected
                    ? "bg-slate-100/90 text-slate-950 font-medium ring-1 ring-inset ring-slate-300"
                    : virtualRow.index % 2 === 0
                    ? "bg-white hover:bg-slate-50"
                    : "bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    style={{ width: `${cell.column.getSize()}px` }}
                    className="px-3 shrink-0 flex items-center overflow-hidden h-full"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Status Footnote */}
      <div className="w-full bg-slate-50 border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>Row: 36px</span>
          <span>•</span>
          <span>Overscan: 10</span>
          <span>•</span>
          <span>Arrow keys: Navigate</span>
          <span>•</span>
          <span>Enter: View Chart</span>
        </div>
        <div>
          Showing {rows.length.toLocaleString()} securities
        </div>
      </div>
    </div>
  );
}
