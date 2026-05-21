import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF6F0',
        foreground: '#2C2625',
        muted: '#5C5452',
        rose: {
          50: '#FAF4F3',
          100: '#F5E8E7',
          200: '#EBD1CD',
          300: '#E8C5C1',
          400: '#D6A6A0',
          500: '#C48881',
          600: '#A4635D',
        },
        ivory: {
          50: '#FDFCFB',
          100: '#FAF6F0',
          200: '#F2E8D9',
          300: '#EADAC2',
          400: '#E2CCAA',
          500: '#CBAF82',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E9EFEA',
          200: '#D4E0D6',
          300: '#B5C9B7',
          400: '#95B098',
          500: '#759679',
        },
        lavender: {
          50: '#F7F6F9',
          100: '#EFEBF2',
          200: '#DED6E5',
          300: '#C9C0D3',
          400: '#B0A3BE',
          500: '#9483A6',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5EFEA',
          200: '#E8DDD0',
          300: '#DBCAB5',
          400: '#CDB79A',
          500: '#B69A76',
        },
        peach: {
          50: '#FDF7F5',
          100: '#FAF0EB',
          200: '#F2D4C8',
          300: '#EAB8A5',
          400: '#E29C82',
          500: '#D17C5D',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;
