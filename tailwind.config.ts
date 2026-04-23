import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        sidebar: {
          DEFAULT: "#0f1c2e",
          card: "#1e2d42",
          border: "#243347",
          hover: "#162032",
        },
      },
      keyframes: {
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulse2: "pulse2 2s ease-in-out infinite",
        fadeUp: "fadeUp 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
