import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Robots.txt — TASK-023 (SPEC-08)
// Allow public routes; disallow /app/* and /admin/*
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
