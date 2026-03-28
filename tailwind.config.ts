import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      transitionDuration: {
        'motion-instant': 'var(--motion-duration-instant)',
        'motion-short': 'var(--motion-duration-short)',
        'motion-medium': 'var(--motion-duration-medium)',
        'motion-long': 'var(--motion-duration-long)',
      },
      transitionTimingFunction: {
        'motion-standard': 'var(--motion-ease-standard)',
        'motion-emphasized': 'var(--motion-ease-emphasized)',
      },
    },
  },
  plugins: [],
} satisfies Config
