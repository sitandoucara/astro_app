/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './features/**/*.{js,ts,tsx}',
    './shared/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  safelist: [
    // Background colors
    'bg-[#F2EAE0]',
    'bg-[#281109]',
    'bg-[#442F29]/50',
    'bg-[#91837C]',
    'bg-[#584540]',
    'bg-[#F6D5C1]',
    'bg-[#32221E]',
    'bg-[#8B7E78]',
    'bg-[#402B25]',
    'bg-[#F5F0ED]',
    'bg-[#5D4B46]',
    'bg-[#0F0A0A]',

    // Text colors
    'text-[#32221E]',
    'text-[#F2EAE0]',
    'text-[#7B635A]',
    'text-[#ffffff]',
    'text-[#ffff]',
    'text-[#D8D3D0]',
    'text-[#D9D5D4]',
    'text-[#F6D5C1]',
    'text-[#A8958C]',
    'text-[#D8C8B4]',

    // Border colors
    'border-[#281109]',
    'border-[#F2EAE0]',

    // Optional: add all other dynamic classes you might need
  ],
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
