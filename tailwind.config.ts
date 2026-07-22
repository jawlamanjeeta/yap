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
          paper: "#eef8f3",
          ink: "#10201f",
          blue: "#2563eb",
          mint: "#00a67e",
          coral: "#ff4d6d",
          gold: "#f7b801",
        },
      },
    },
  },
  plugins: [],
};
export default config;
