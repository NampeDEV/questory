import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Sitemap — TASK-022 (SPEC-08)
// Excludes /app/* and /admin/* (private routes)
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/boards`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/plans`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/memories`,lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/shop`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/plans`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/activate`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  return staticRoutes;
}
