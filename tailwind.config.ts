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
          yellow: "#ffeb99",
          orange: "#f59e0b",
          flame: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
