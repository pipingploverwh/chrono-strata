import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Orientation breakpoints
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Semantic margin colors
        margin: {
          high: "hsl(var(--margin-high))",
          medium: "hsl(var(--margin-medium))",
          low: "hsl(var(--margin-low))",
        },
        // Semantic confidence colors
        confidence: {
          high: "hsl(var(--confidence-high))",
          medium: "hsl(var(--confidence-medium))",
          low: "hsl(var(--confidence-low))",
        },
        // Status colors
        status: {
          approved: "hsl(var(--status-approved))",
          pending: "hsl(var(--status-pending))",
          rejected: "hsl(var(--status-rejected))",
        },
        // Lavender identity
        lavender: {
          DEFAULT: "hsl(var(--lavender))",
          dim: "hsl(var(--lavender-dim))",
          glow: "hsl(var(--lavender-glow))",
        },
        // Surface layers
        surface: {
          0: "hsl(var(--surface-0))",
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
        // Piping Plover coastal palette
        plover: {
          DEFAULT: "hsl(var(--plover))",
          foreground: "hsl(var(--plover-foreground))",
          sand: "hsl(var(--plover-sand))",
          cream: "hsl(var(--plover-cream))",
          dune: "hsl(var(--plover-dune))",
          sage: "hsl(var(--plover-sage))",
          earth: "hsl(var(--plover-earth))",
        },
        // APEX-1 DJ Table Design System
        apex: {
          glow: "hsl(var(--apex-glow))",
          "glow-bright": "hsl(var(--apex-glow-bright))",
          "glow-dim": "hsl(var(--apex-glow-dim))",
          "glow-subtle": "hsl(var(--apex-glow-subtle))",
          carbon: "hsl(var(--apex-carbon))",
          titanium: "hsl(var(--apex-titanium))",
          marble: "hsl(var(--apex-marble))",
          walnut: "hsl(var(--apex-walnut))",
          brass: "hsl(var(--apex-brass))",
          go: "hsl(var(--apex-go))",
          hold: "hsl(var(--apex-hold))",
          stop: "hsl(var(--apex-stop))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        // Generous spacing for breathing room
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade": "fade-in 0.3s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
