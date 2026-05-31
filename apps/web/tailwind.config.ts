import type { Config } from 'tailwindcss';
import { colors, fontSize, radius, shadow } from './src/styles/tokens';

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      fontSize,
      borderRadius: radius,
      boxShadow: shadow,
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-sans-en)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'var(--font-display)', 'serif'],
        display: ['var(--font-display)', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} satisfies Config;
