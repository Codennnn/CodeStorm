import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        contrary: colors.white,
        main: colors.slate[900],
        'main-bold': colors.slate[700],
        comment: colors.slate[500],

        'resume-desc': colors.slate[500],
      },
      height: {
        header: 'var(--header-height)',
      },
      minWidth: {
        content: 'var(--min-content-width)',
      },
      maxWidth: {
        content: 'var(--max-content-width)',
      },
      padding: {
        header: 'var(--header-height)',
      },
      borderWidth: { 3: '3px' },
      outlineWidth: { 3: '3px' },
      fontSize: {
        xsm: [
          '0.82rem',
          {
            lineHeight: '1.5rem',
          },
        ],
      },
    },
  },

  corePlugins: {
    preflight: false,
  },

  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config
