'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Error boundary for the admin route group
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin-error]', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
        <span className="text-3xl">⚠️</span>
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-forest-900">เกิดข้อผิดพลาดในระบบ Admin</h2>
        <p className="mt-2 text-sm text-muted">
          กรุณาลองใหม่ หรือติดต่อทีม Dev หากปัญหายังคงอยู่
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted/60">ref: {error.digest}</p>
        )}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-3 text-left">
            <summary className="cursor-pointer text-xs text-muted">Stack trace (dev only)</summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-300">
              {error.stack}
            </pre>
          </details>
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
          href="/admin"
          className="rounded-lg border border-forest-800/20 px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-sand-100"
        >
          กลับ Dashboard
        </Link>
      </div>
    </div>
  );
}
