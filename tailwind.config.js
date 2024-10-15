/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e6ff',
          100: '#ccccff',
          200: '#9999ff',
          300: '#6666ff',
          400: '#3333ff',
          500: '#1717FB',
          600: '#0000e6',
          700: '#0000cc',
          800: '#0000b3',
          900: '#000099',
          950: '#000080',
        },
      },
    },
  },
  plugins: [],
};