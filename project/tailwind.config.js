/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px', // 添加更大的屏幕尺寸
      },
    },
  },
  plugins: [],
};