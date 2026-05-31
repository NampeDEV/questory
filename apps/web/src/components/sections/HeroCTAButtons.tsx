'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/utils/analytics';

/** Client component so we can fire analytics on CTA click (AC-LANDING-009). */
export function HeroCTAButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button
        variant="gold"
        size="lg"
        asChild
        onClick={() => analytics.startQuestClick('hero')}
      >
        <Link href="/activate">Start Your Quest</Link>
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="border-white/25 bg-white/10 text-white hover:bg-white/20"
        asChild
      >
        <Link href="/boards">Explore Boards</Link>
      </Button>
    </div>
  );
}
