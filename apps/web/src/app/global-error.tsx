'use client';

// FE-PAGE-GLOBAL-ERROR (SPEC-08) — TASK-020
// Must include <html> and <body> tags (required by Next.js for global-error)
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-parchment px-4 text-center font-sans">
        <span className="text-6xl" role="img" aria-label="เกิดข้อผิดพลาด">⚠️</span>
        <h1 className="text-2xl font-bold text-forest-900">เกิดข้อผิดพลาดที่ไม่คาดคิด</h1>
        <p className="text-sm text-muted">กรุณาลองใหม่อีกครั้ง</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-forest-800 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
        >
          ลองอีกครั้ง
        </button>
      </body>
    </html>
  );
}
