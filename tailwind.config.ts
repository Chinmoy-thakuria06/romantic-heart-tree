import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(255, 160, 220, 0.22)"
      },
      backgroundImage: {
        "romantic-gradient":
          "radial-gradient(circle at top, rgba(255, 193, 219, 0.25), transparent 26%), linear-gradient(180deg, #0a1022 0%, #1a1038 36%, #34194f 68%, #10182d 100%)"
      },
      colors: {
        blush: {
          50: "#fff1f8",
          100: "#ffe3f1",
          200: "#ffc8e4",
          300: "#ffaad5",
          400: "#ff8bc5",
          500: "#ff69b4",
          600: "#ea4f9b",
          700: "#bf3378",
          800: "#8d2156",
          900: "#5d1036"
        }
      }
    }
  },
  plugins: []
};

export default config;
