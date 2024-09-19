/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-radial': 'radial-gradient(at 6.47% 10.05%, rgb(5, 150, 105) 0, transparent 100%), radial-gradient(at 1.05% 46.05%, rgb(4, 120, 87) 0, transparent 63%), radial-gradient(at 87.33% 5.83%, rgb(16, 185, 129) 0, transparent 100%), radial-gradient(at 37.89% 44.33%, rgb(6, 95, 70) 0, transparent 100%);',
      },
      backgroundColor: {
        'custom-white': 'rgb(255, 255, 255)',
      },
      inset: ['group-hover'],
      transitionDelay: ['group-hover'],
    },
  },
  plugins: [],
}

