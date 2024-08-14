/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';
export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',

  // Or if using `src` directory:
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
];
export const theme = {
  extend: {},
};
export const darkMode = 'class';
export const plugins = [
  nextui({
    prefix: 'nextui', // prefix for themes variables
    addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
    // defaultTheme: 'dark', // default theme from the themes object
    // defaultExtendTheme: 'dark', // default theme to extend on custom themes
    layout: {
      radius: {
        small: '0.8rem',
        medium: '1rem',
        large: '2rem',
      },
      borderWidth: {
        small: '1px',
        medium: '2px',
        large: '3px',
      },
    }, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          primary: {
            DEFAULT: '#4349E6',
          },
          secondary2: {
            DEFAULT: '#100f0f',
          },
          focus: '#4349E6',
        }, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {
          background: {
            DEFAULT: '#0A0A0A',
          },
          primary: {
            DEFAULT: '#4349E6',
            foreground: '#FFFFFF',
          },
          secondary2: {
            DEFAULT: '#100f0f',
          },
          focus: '#4349E6',
        }, // dark theme colors
      },
      // ... custom themes
    },
  }),
];
