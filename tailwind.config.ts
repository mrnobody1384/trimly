import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mgray: "#c2c2c2",
        myellow: "#FFB900",
        mblack: "1D1C19",
        mgrayer: "#6A6760",
      },
    },
  },
  plugins: [],
} satisfies Config;
