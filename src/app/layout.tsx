import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Real-Time Stock Screener | Virtualised Grid & Candlestick Charts",
  description: "High-performance institutional-grade stock screener scanning 5,000+ stocks in <200ms with live WebSocket feed and TradingView charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
