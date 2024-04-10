/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('../assets/uet.png')",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
