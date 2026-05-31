import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

// SEO factory — TASK-021 (SPEC-08)
type BuildMetaOptions = {
  title: string;
  description: string;
  image?: string;
  path?: string;
};

export function buildMeta({ title, description, image, path }: BuildMetaOptions): Metadata {
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const ogImage = image ?? `${siteConfig.url}/og-default.png`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
