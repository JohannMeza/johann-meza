/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    backgroundColor: {
      'primary': '#160F6F',
      'secondary': '#88006F',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-blue-700': '#160F6F',
      'gradient-blue-600': '#00429E',
      'gradient-blue-500': '#006BBB',
      'gradient-blue-400': '#0093C6',
      'gradient-blue-300': '#00BAC5',
      'gradient-blue-200': '#30DEC0',

      'gradient-rose-600': '#88006F',
      'gradient-rose-500': '#AF3793',
      'gradient-rose-400': '#D85FB8',
      'gradient-rose-300': '#FF85DF',
      'gradient-rose-200': '#FFACFF',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      "red-500": "#D90429",
    },
    textColor: {
      'primary': '#160F6F',
      'secondary': '#88006F',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      'gradient-blue-700': '#160F6F',
      'gradient-blue-600': '#00429E',
      'gradient-blue-500': '#006BBB',
      'gradient-blue-400': '#0093C6',
      'gradient-blue-300': '#00BAC5',
      'gradient-blue-200': '#30DEC0',

      'gradient-rose-600': '#88006F',
      'gradient-rose-500': '#AF3793',
      'gradient-rose-400': '#D85FB8',
      'gradient-rose-300': '#FF85DF',
      'gradient-rose-200': '#FFACFF',

      "red-500": "#D90429",
      "inherit": "inherit",
    },
    borderColor: {
      'primary': '#160F6F',
      'secondary': '#88006F',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-blue-700': '#160F6F',
      'gradient-blue-600': '#00429E',
      'gradient-blue-500': '#006BBB',
      'gradient-blue-400': '#0093C6',
      'gradient-blue-300': '#00BAC5',
      'gradient-blue-200': '#30DEC0',

      'gradient-rose-600': '#88006F',
      'gradient-rose-500': '#AF3793',
      'gradient-rose-400': '#D85FB8',
      'gradient-rose-300': '#FF85DF',
      'gradient-rose-200': '#FFACFF',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      "red-500": "#D90429",
    },
    outlineColor: {
      'primary': '#160F6F',
      'secondary': '#88006F',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-blue-700': '#160F6F',
      'gradient-blue-600': '#00429E',
      'gradient-blue-500': '#006BBB',
      'gradient-blue-400': '#0093C6',
      'gradient-blue-300': '#00BAC5',
      'gradient-blue-200': '#30DEC0',

      'gradient-rose-600': '#88006F',
      'gradient-rose-500': '#AF3793',
      'gradient-rose-400': '#D85FB8',
      'gradient-rose-300': '#FF85DF',
      'gradient-rose-200': '#FFACFF',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      "red-500": "#D90429",
    },
    fontFamily: {
      'Roboto': 'roboto, sans-serif',
      'Poppins': 'poppins, sans-serif',
    },
    fontSize: {
      'title-1': '35px',
      'title-2': '25px',
      'title-3': '20px',
      
      'button-1': '20px',
      'button-2': '18px',
      'button-3': '14px',

      'paragraph-1': '18px',
      'paragraph-2': '16px',
      'paragraph-3': '14px',
      
      'span-1': '12px',
      'span-2': '10px',
      'span-3': '8px',
    },
    colors: {
      'primary': '#160F6F',
      'secondary': '#88006F',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      'gradient-blue-700': '#160F6F',
      'gradient-blue-600': '#00429E',
      'gradient-blue-500': '#006BBB',
      'gradient-blue-400': '#0093C6',
      'gradient-blue-300': '#00BAC5',
      'gradient-blue-200': '#30DEC0',

      'gradient-rose-600': '#88006F',
      'gradient-rose-500': '#AF3793',
      'gradient-rose-400': '#D85FB8',
      'gradient-rose-300': '#FF85DF',
      'gradient-rose-200': '#FFACFF',

      "red-500": "#D90429",
      "inherit": "inherit",
    },
    extend: {
      backgroundImage: theme => ({
        'gradient': 'linear-gradient(90deg,rgba(136, 1, 111, 0.9) 0%,rgba(22, 15, 111, 0.9) 100%)',
        'banner': 'url(/assets/imagenes/banner.png)',
        'banner-opacity': 'linear-gradient(90deg,rgba(136, 1, 111, 0.9) 0%,rgba(22, 15, 111, 0.9) 100%), url(/assets/imagenes/banner.png)',
        'banner-blog-opacity': 'linear-gradient(90deg,rgba(136, 1, 111, 0.9) 0%,rgba(22, 15, 111, 0.9) 100%), url(/assets/imagenes/blogBanner.png)',
      }),
      backgroundColor: theme => ({
        'loader': 'rgba(22, 15, 111, 0.8)',
      })
    },
  },
  plugins: [
    require('tw-elements/dist/plugin.cjs')
  ]
}