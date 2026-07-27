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
        page: "var(--page)",
        surface: "var(--surface)",
        "surface-solid": "var(--surface-solid)",
        "surface-hover": "var(--surface-hover)",
        "surface-inner": "var(--surface-inner)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          bright: "var(--accent-bright)",
          soft: "var(--accent-soft)",
          deep: "var(--accent-deep)",
          glow: "var(--accent-glow)",
        },
        negative: "var(--negative)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
