/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fa9a00', // Updated orange
        secondary: '#FEB47B',
        background: '#ffffff', // White background
      }
    },
  },
  plugins: [],
}
