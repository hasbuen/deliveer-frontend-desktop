/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      extend: {
        colors: {
          'roxo': '#5a189a',
          'gelo':  '#edf6f9',
          'rosa':  'ff0054',
          'laranja': 'f35b04',
          'ambar': '#ffbd00',
        },
      },
    },
  },
  plugins: [],
};
