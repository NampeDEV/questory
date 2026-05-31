import type { Metadata } from 'next';
import { siteConfig } from './site';

// TASK-021 (SPEC-08) — SEO metadata factory.
// Usage:
//   export const metadata = buildMeta({ title: 'Boards', description: '...' });
//   export const metadata = buildMeta({ title: 'Doi Inthanon', image: '/og/boards.jpg' });

type BuildMetaOptions = {
  /** Page-level title — appended with ` — Questory` */
  title?: string;
  description?: string;
  /** Absolute or root-relative URL for og:image. Defaults to /images/og-default.jpg */
  image?: string;
  /** Canonical URL. Defaults to siteConfig.url */
  canonical?: string;
  /** Set true for private pages (/app/*, /admin/*) to block indexing. */
  noIndex?: boolean;
};

export function buildMeta({
  title,
  description,
  image = '/images/og-default.jpg',
  canonical,
  noIndex = false,
}: BuildMetaOptions = {}): Metadata {
  const pageTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.name;
  const desc      = description ?? siteConfig.description;
  const base      = siteConfig.url;
  const canonicalUrl = canonical ?? base;

  return {
    title:       pageTitle,
    description: desc,
    metadataBase: new URL(base),
    alternates:  { canonical: canonicalUrl },
    keywords:    siteConfig.keywords.join(', '),
    openGraph: {
      title:       pageTitle,
      description: desc,
      url:         canonicalUrl,
      siteName:    siteConfig.name,
      locale:      'th_TH',
      type:        'website',
      images: [{ url: image, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       pageTitle,
      description: desc,
      images:      [image],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
