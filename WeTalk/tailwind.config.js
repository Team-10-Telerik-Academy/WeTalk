/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#0A2A4C', // blue

          secondary: '#FFFFFF', // white

          accent: '#FFC436', // yellow

          success: '#36d399', // green

          error: '#f87272', // red
        },
        dark: {
          primary: '#0A2A4C', // blue

          secondary: '#FFFFFF', // white

          accent: '#FFC436', // yellow

          success: '#36d399', // green

          error: '#f87272', // red
        },
      },
    ],
  },
};
