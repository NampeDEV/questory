import { Noto_Sans_Thai, Noto_Serif_Thai, Inter } from 'next/font/google';

export const sans = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-en',
  display: 'swap',
});

export const serif = Noto_Serif_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '700'],
});

export const display = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
});
