import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yap: {
          paper: "#f8efd0",
          ink: "#080907",
          blue: "#55d7ff",
          mint: "#b8ff4f",
          coral: "#ff6b8a",
          gold: "#ffd84d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
