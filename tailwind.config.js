/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core brand
        primary:                  '#944A00',
        'on-primary':             '#FFFFFF',
        'primary-container':      '#FFDCC5',
        'on-primary-container':   '#301400',
        'primary-fixed':          '#FFDCC5',
        'primary-fixed-dim':      '#FFB783',
        'on-primary-fixed':       '#301400',
        'on-primary-fixed-variant':'#713700',
        'inverse-primary':        '#FFB783',

        secondary:                '#4E6073',
        'on-secondary':           '#FFFFFF',
        'secondary-container':    '#CFE2F9',
        'on-secondary-container': '#526478',
        'secondary-fixed':        '#D1E4FB',
        'secondary-fixed-dim':    '#B5C8DF',
        'on-secondary-fixed':     '#091D2E',
        'on-secondary-fixed-variant': '#36485B',

        tertiary:                 '#00658F',
        'on-tertiary':            '#FFFFFF',
        'tertiary-container':     '#00A3E4',
        'on-tertiary-container':  '#00354D',
        'tertiary-fixed':         '#C7E7FF',
        'tertiary-fixed-dim':     '#86CFFF',
        'on-tertiary-fixed':      '#001E2E',
        'on-tertiary-fixed-variant':'#004C6D',

        error:                    '#BA1A1A',
        'on-error':               '#FFFFFF',
        'error-container':        '#FFDAD6',
        'on-error-container':     '#93000A',

        // Surfaces
        surface:                  '#F8F9FA',
        'on-surface':             '#191C1D',
        'surface-variant':        '#E1E3E4',
        'on-surface-variant':     '#564337',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low':  '#F3F4F5',
        'surface-container':      '#EDEEEF',
        'surface-container-high': '#E7E8E9',
        'surface-container-highest':'#E1E3E4',
        'surface-dim':            '#D9DADB',
        'surface-bright':         '#F8F9FA',
        'surface-tint':           '#944A00',
        'inverse-surface':        '#2E3132',
        'inverse-on-surface':     '#F0F1F2',

        outline:                  '#897365',
        'outline-variant':        '#DCC1B1',
        background:               '#F8F9FA',
        'on-background':          '#191C1D',
      },
      fontFamily: {
        sans:    ['Tajawal', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Tajawal', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm:      '0.375rem',
        md:      '0.75rem',
        lg:      '1rem',
        xl:      '1.25rem',
        '2xl':   '1.5rem',
        '3xl':   '2rem',
        full:    '9999px',
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(25, 28, 29, 0.06)',
        card:    '0 4px 24px rgba(25, 28, 29, 0.08)',
        glass:   '0 -10px 30px rgba(25, 28, 29, 0.04)',
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #944A00 0%, #E67E22 100%)',
        'warm-gradient-tr': 'linear-gradient(to top right, #944A00, #E67E22)',
      },
    },
  },
  plugins: [],
};
