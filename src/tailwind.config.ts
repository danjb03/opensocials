
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#000000",
        input: "#000000",
        ring: "#000000",
        background: "#FFFFFF",
        foreground: "#000000",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        sidebar: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
          primary: "#000000",
          'primary-foreground': "#FFFFFF",
          accent: "#333333",
          'accent-foreground': "#FFFFFF",
          border: "#000000",
          ring: "#000000"
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'stagger-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(15px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'bounce-in': {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8'
          },
          '70%': {
            transform: 'scale(0.9)',
            opacity: '0.9'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'stagger-fade-in': 'stagger-fade-in 0.4s ease-out forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px',
      },
      fontSize: {
        'xs-mobile': '0.875rem',
        'sm-mobile': '1rem',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
