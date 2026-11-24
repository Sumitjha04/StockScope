import { NextRequest, NextResponse } from "next/server";
import { generate5000Stocks, generateCandlestickHistory } from "@/lib/stockGenerator";

let cachedStocks: ReturnType<typeof generate5000Stocks> | null = null;

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  if (!cachedStocks) {
    cachedStocks = generate5000Stocks(5200);
  }

  const ticker = params.ticker.toUpperCase();
  const stock = cachedStocks.find((s) => s.ticker === ticker);

  if (!stock) {
    return NextResponse.json({ success: false, error: "Stock not found" }, { status: 404 });
  }

  const candles = generateCandlestickHistory(stock, 120);

  return NextResponse.json({
    success: true,
    stock,
    candles,
  });
}
