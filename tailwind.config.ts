import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
        },
        trade: {
          green: "#15803d",
          greenLight: "#dcfce7",
          greenMuted: "#f0fdf4",
          red: "#b91c1c",
          redLight: "#fee2e2",
          redMuted: "#fef2f2",
          blue: "#2563eb",
          slate: "#334155",
        },
      },
      animation: {
        "flash-green": "flashGreen 1s ease-out forwards",
        "flash-red": "flashRed 1s ease-out forwards",
      },
      keyframes: {
        flashGreen: {
          "0%": { backgroundColor: "#dcfce7" },
          "100%": { backgroundColor: "transparent" },
        },
        flashRed: {
          "0%": { backgroundColor: "#fee2e2" },
          "100%": { backgroundColor: "transparent" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
