/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['"Geist"', 'system-ui', 'sans-serif'],
        gmono: ['"Geist Mono"', 'system-ui', 'sans-serif'],
      },
      colors: {
        prtext: "#FFFFFF",
        sectext: "#A0A0A0",
        actdata: "#00F2FE",
        actcta: "#B8860B",
        ctalight: "#FAF3C0",
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            opacity: '0'
          },
          '50%': {
            opacity: '1',

          },
        },
        tyreSpin: {
          '0%': {
            transform: 'rotateZ(0deg) translateY(0px)',
          },
          '25%': {
            transform: 'rotateZ(90deg) translateY(-2px)',
          },
          '50%': {
            transform: 'rotateZ(180deg) translateY(0px)',
          },
          '75%': {
            transform: 'rotateZ(270deg) translateY(2px)',
          },
          '100%': {
            transform: 'rotateZ(360deg) translateY(0px)',
          },
        },
        GoUp: {
          '0%': {
            transform: 'translateY(40px) rotateZ(-10deg)',
            opacity: '0.3',

          },
          '100%': {
            transform: 'translateY(0) rotateZ(0deg)',
            opacity: '1',
          }
        },
        ShadowGoUp: {
          '0%': {
            transform: 'translateY(40px)',
            opacity: '0.0',

          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '0.2',
          }
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 1s infinite',
        spinSlow: 'spin 8s linear infinite',
        tyreSpin: 'tyreSpin 7s linear infinite',
        GoUp: 'GoUp 2s ease forwards',
        ShadowGoUp: 'ShadowGoUp 2s ease 0.5s forwards',
          blink: 'blink 1s steps(1, end) infinite',

      },
    },
  },
  plugins: [],
}