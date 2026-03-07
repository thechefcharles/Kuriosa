/**
 * Kuriosa design tokens — brand direction and design system foundation.
 * These values inform the Tailwind theme and component styling.
 */

export const colors = {
  primary: {
    deepPurple: "hsl(265, 89%, 36%)",
    midnightBlue: "hsl(222, 47%, 16%)",
    electricCyan: "hsl(187, 85%, 45%)",
  },
  neutral: {
    50: "hsl(210, 40%, 98%)",
    100: "hsl(210, 40%, 96%)",
    200: "hsl(214, 32%, 91%)",
    300: "hsl(213, 27%, 84%)",
    400: "hsl(215, 20%, 65%)",
    500: "hsl(215, 16%, 47%)",
    600: "hsl(215, 19%, 35%)",
    700: "hsl(215, 25%, 27%)",
    800: "hsl(217, 33%, 17%)",
    900: "hsl(222, 47%, 11%)",
    950: "hsl(229, 84%, 5%)",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  },
} as const;
