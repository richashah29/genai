import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f0f9f4',
          100: '#dbf0e4',
          200: '#bae2ce',
          300: '#8bccae',
          400: '#56b08b',
          500: '#35946f',
          600: '#26765a',
          700: '#205f4a',
          800: '#1b4c3d',
          900: '#183f34',
        },
        warm: {
          50: '#fef8f0',
          100: '#fdeed9',
          200: '#fad9b2',
          300: '#f6be80',
          400: '#f1994d',
          500: '#ed7b22',
          600: '#de6118',
          700: '#b84a16',
          800: '#933b19',
          900: '#773318',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
