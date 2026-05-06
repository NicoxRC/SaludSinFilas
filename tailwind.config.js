/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E6FBF',
          50: '#EBF3FB',
          100: '#C4D9F1',
          200: '#9DC0E7',
          300: '#76A6DD',
          400: '#4F8DD3',
          500: '#1E6FBF',
          600: '#1A62AB',
          700: '#155497',
          800: '#114783',
          900: '#0C3A6F',
        },
        secondary: {
          DEFAULT: '#28A745',
          50: '#EAF7EE',
          100: '#C2E9CC',
          200: '#9ADAAB',
          300: '#72CB89',
          400: '#4ABD68',
          500: '#28A745',
          600: '#24963E',
          700: '#1F8436',
          800: '#1A732F',
          900: '#156227',
        },
        background: '#F5F7FA',
        textPrimary: '#1A1A2E',
      },
    },
  },
  plugins: [],
}
