/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/**/*.{html,tsx,ts,js,jsx,ejs}'],
  theme: {
    screen: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        pikachu: ['Cute Font', 'cursive'],
        game: ['Press Start 2P', 'cursive'],
      },
      colors: {
        babyBlue: '#E7F2F8',
        aquamarine: '#74BDCB',
        salmon: '#FFA384',
        freesia: '#EFE7BC',
      },
    },
  },
  plugins: [],
};
