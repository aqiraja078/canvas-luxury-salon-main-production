import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#c9a962",
          light: "#e8d5a3",
          dark: "#8b7340",
          accent: "#d4af7f",
        },
        nude: {
          DEFAULT: "#e8d4cf",
          deep: "#c4a59e",
          muted: "#f5ebe8",
          light: "#f9f3f0",
        },
        slate: {
          925: "#0f1118",
          950: "#0a0e14",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        luxury: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        gold: "0 0 40px rgba(201, 169, 98, 0.25)",
        "card-hover": "0 20px 60px -15px rgba(201, 169, 98, 0.2)",
        "card-lifted": "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        "glow-soft": "0 0 50px rgba(201, 169, 98, 0.15)",
        "deep-gold": "0 0 60px rgba(201, 169, 98, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "luxury-dark":
          "linear-gradient(180deg, #0a0a0a 0%, #121212 50%, #0a0a0a 100%)",
        "luxury-subtle":
          "linear-gradient(135deg, rgba(10,10,10,1) 0%, rgba(18,18,18,0.8) 50%, rgba(10,10,10,1) 100%)",
        "gold-gradient": "linear-gradient(135deg, #e8d5a3 0%, #c9a962 50%, #8b7340 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glow-soft": "glow-soft 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.6s ease-out",
        "scale-in": "scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-soft": {
          "0%, 100%": { boxShadow: "0 0 28px rgba(201, 169, 98, 0.12)" },
          "50%": { boxShadow: "0 0 48px rgba(201, 169, 98, 0.22)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
