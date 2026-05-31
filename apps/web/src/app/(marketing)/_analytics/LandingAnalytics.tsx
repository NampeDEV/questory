'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/utils/analytics';

/**
 * Client-only component that fires `landing_view` once on mount.
 * Rendered inside the Server Component homepage.
 */
export function LandingAnalytics() {
  useEffect(() => {
    analytics.landingView();
  }, []);

  return null;
}
