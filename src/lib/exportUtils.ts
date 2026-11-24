import { Stock } from "../types/stock";

export function exportStocksToCSV(stocks: Stock[], filename = "screener-export.csv") {
  if (stocks.length === 0) return;

  const headers = [
    "Ticker",
    "Company Name",
    "Sector",
    "Index",
    "Market Cap Cat",
    "LTP (₹)",
    "Change (%)",
    "Volume",
    "Market Cap (Cr)",
    "P/E",
    "P/B",
    "ROE (%)",
    "ROCE (%)",
    "Dividend Yield (%)",
    "Debt/Equity",
    "RSI (14)",
    "SMA 50",
    "SMA 200",
    "Golden Cross",
  ];

  const rows = stocks.map((s) => [
    s.ticker,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.sector}"`,
    `"${s.index}"`,
    s.marketCapCategory,
    s.ltp,
    s.changePercent,
    s.volume,
    s.fundamentals.marketCapCr,
    s.fundamentals.peRatio,
    s.fundamentals.pbRatio,
    s.fundamentals.roe,
    s.fundamentals.roce,
    s.fundamentals.dividendYield,
    s.fundamentals.debtToEquity,
    s.technicals.rsi14,
    s.technicals.sma50,
    s.technicals.sma200,
    s.technicals.goldenCross ? "Yes" : "No",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportStocksToJSON(stocks: Stock[], filename = "screener-export.json") {
  if (stocks.length === 0) return;
  const jsonStr = JSON.stringify(stocks, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
