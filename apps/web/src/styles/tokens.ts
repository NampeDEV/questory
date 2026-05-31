// DS-COLOR · Design system color tokens (SPEC-05)
export const colors = {
  forest: {
    950: '#071B16',
    900: '#0B2A22',
    800: '#12382E',
    700: '#1E4D3E',
    600: '#2B6152',
    500: '#4A8B78',
    400: '#72B0A0',
    300: '#9DCABD',
    200: '#C4DDD8',
    100: '#E8F4F1',
  },
  moss: {
    500: '#6F8F4E',
  },
  gold: {
    400: '#E9C46A',
    500: '#D6A84F',
  },
  sand: {
    100: '#F5EFE3',
    200: '#E8DDC8',
  },
  parchment: '#FBF6EA',
  ink: '#17211D',
  muted: '#6D746F',
  danger: '#B85C38',
  success: '#2F7D55',
  // Semantic aliases used in components
  card: 'rgba(255, 250, 240, 0.92)',
};

// DS-TYPE · Typography scale (SPEC-05)
export const fontSize: Record<
  string,
  [string, { lineHeight: string; letterSpacing?: string }]
> = {
  xs: ['12px', { lineHeight: '1.5' }],
  sm: ['14px', { lineHeight: '1.55' }],
  base: ['16px', { lineHeight: '1.6' }],
  lg: ['18px', { lineHeight: '1.55' }],
  xl: ['24px', { lineHeight: '1.4' }],
  '2xl': ['32px', { lineHeight: '1.3' }],
  '3xl': ['44px', { lineHeight: '1.2' }],
  hero: ['64px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
};

// DS-RADIUS · Border radius scale (SPEC-05)
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  pill: '9999px',
};

// DS-SHADOW · Shadow tokens (SPEC-05)
export const shadow = {
  card: '0 12px 40px rgba(7, 27, 22, 0.12)',
  lift: '0 16px 48px rgba(7, 27, 22, 0.18)',
  inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
  badge: '0 0 0 2px rgba(214,168,79,0.4)',
};
