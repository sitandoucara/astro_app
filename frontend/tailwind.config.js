/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './features/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F2EAE0',
          border: '#32221E',
          text1: '#32221E',
          text2: '#7B635A',
          text3: '#FFFFFF',
          cardback: '#32221E80',
        },

        dark: {
          background: '#281109',
          border: '#F2EAE0',
          text1: '#F2EAE0',
        },
      },
    },
  },
  plugins: [],
};
