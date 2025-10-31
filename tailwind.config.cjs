module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nebula-900': '#04050a',
        'nebula-800': '#0b1220',
        'nebula-700': '#0f1724',
        'accent-500': '#7c3aed',
        'accent-400': '#5eead4',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Orbitron', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
