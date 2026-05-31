'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Global error boundary for the marketing route group
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service (e.g., PostHog, Sentry) in production
    console.error('[marketing-error]', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
        <span className="text-3xl">⚠️</span>
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-forest-900">เกิดข้อผิดพลาด</h2>
        <p className="mt-2 text-sm text-muted">
          ไม่สามารถโหลดหน้านี้ได้ กรุณาลองใหม่อีกครั้ง
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted/60">ref: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
        >
          ลองใหม่
        </button>
        <Link
          href="/"
          className="rounded-lg border border-forest-800/20 px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-sand-100"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
