'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

// S-043 — PostHog client-side analytics provider.
// Wrap the root layout body to enable automatic page-view tracking.
//
// Required env vars:
//   NEXT_PUBLIC_POSTHOG_KEY   (Project API key from posthog.com)
//   NEXT_PUBLIC_POSTHOG_HOST  (default: https://app.posthog.com)

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // Managed manually via usePathname hook
      capture_pageleave: true,
      loaded: (ph) => {
        // Disable in dev so local events don't pollute production data
        if (process.env.NODE_ENV === 'development') {
          ph.opt_out_capturing();
        }
      },
    });
    } catch (err) {
      console.error('[PostHog] init failed:', err);
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
