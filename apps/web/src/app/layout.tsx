import type { Metadata } from 'next';
import { sans, inter, serif, display } from '@/styles/fonts';
import '@/styles/globals.css';
import { siteConfig } from '@/config/site';
import { PostHogProvider } from '@/lib/providers/PostHogProvider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="th"
      className={`${sans.variable} ${inter.variable} ${serif.variable} ${display.variable}`}
    >
      <head>
        <meta name="theme-color" content="#1E4D3E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Questory" />
      </head>
      <body><PostHogProvider>{children}</PostHogProvider></body>
    </html>
  );
}
