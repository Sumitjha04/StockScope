import { NextResponse } from "next/server";
import { generate5000Stocks } from "@/lib/stockGenerator";

// Cache in module scope so it's generated once per server instance
let cachedStocks: ReturnType<typeof generate5000Stocks> | null = null;

export async function GET() {
  if (!cachedStocks) {
    cachedStocks = generate5000Stocks(5200);
  }

  return NextResponse.json({
    success: true,
    count: cachedStocks.length,
    stocks: cachedStocks,
  });
}
