import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080706",
        ember: "#ff8a3d",
        amberSoft: "#ffd09a",
        charcoal: "#14110f",
        mist: "#e8ded1"
      },
      boxShadow: {
        glow: "0 0 50px rgba(255, 138, 61, 0.18)",
        glass: "0 20px 80px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        "radial-warm": "radial-gradient(circle at top left, rgba(255,138,61,.24), transparent 28%), radial-gradient(circle at bottom right, rgba(255,208,154,.09), transparent 30%)"
      }
    },
  },
  plugins: [],
};

export default config;
