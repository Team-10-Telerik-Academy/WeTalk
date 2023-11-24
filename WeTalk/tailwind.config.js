/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {

          "primary": "#0A2A4C", // blue

          "text": "#FFFFFF",

          "secondary": "#FFFFFF", // white

          "accent": "#FFC436", // yellow

          "success": "#36d399", // green

          "error": "#f87272", // red
        },
        light: {

          "primary": "#FFFFFF", // white

          "text": "#0A2A4C",

          "secondary": "#0A2A4C", // blue

          "accent": "#FFC436", // yellow

          "success": "#36d399", // green

          "error": "#f87272", // red
        },
      },
    ],
  },
}
