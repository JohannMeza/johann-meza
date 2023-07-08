module.exports = {
  content: [ 
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    fontFamily: {
      'Roboto': 'roboto, sans-serif',
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
      'primary': '#0F4192',
      'secondary': '#0A7CFF',
      'text': '#222222',
      'none': 'transparent',
      'white': '#fff',

      'gradient-gris-700': '#222222',
      'gradient-gris-500': '#222327',
      'gradient-gris-300': '#777777',
      'gradient-gris-200': '#E8E8E8',
      'gradient-gris-100': '#FFFFFF',

      "red-500": "#D90429",
    },
    extend: {
      backgroundImage: theme => ({
        'gradient': 'linear-gradient(90deg, #88006F 0%, #160F6F 89.14%)',
        'banner': 'url(/assets/imagenes/fondo.jpg)',
        'banner-opacity': 'linear-gradient(90deg, rgba(232, 232, 232, 0.9) 0%, rgba(232, 232, 232, 0.9) 100%), url(./assets/imagenes/fondo.jpg)',
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