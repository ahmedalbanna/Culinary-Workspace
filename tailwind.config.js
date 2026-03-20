/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Core palette ────────────────────────────────────────────────────
        primary: '#944A00',
        'on-primary': '#FFFFFF',
        'primary-container': '#FFDCC5',
        'on-primary-container': '#301400',
        'primary-fixed': '#FFDCC5',

        secondary: '#5D6468',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E1E2E4',
        'on-secondary-container': '#191C1E',
        'secondary-fixed': '#E1E2E4',

        tertiary: '#5A5E61',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#DEE3E6',
        'on-tertiary-container': '#171C1F',

        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'error-container': '#FFDAD6',
        'on-error-container': '#410002',

        // ── Surface hierarchy ────────────────────────────────────────────────
        surface: '#F8F9FA',
        'on-surface': '#191C1D',
        'surface-variant': '#E8EBED',
        'on-surface-variant': '#444749',

        outline: '#747779',
        'outline-variant': 'rgba(116,119,121,0.15)',

        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F3F4F5',
        'surface-container': '#EDEDEF',
        'surface-container-high': '#E7E8EA',
        'surface-container-highest': '#E1E2E4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Tajawal"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(25, 28, 29, 0.06)',
      },
    },
  },
  plugins: [],
};
