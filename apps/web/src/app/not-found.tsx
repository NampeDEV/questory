import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '404 — ไม่พบหน้า' };

// FE-PAGE-404 (SPEC-08) — TASK-019
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl" role="img" aria-label="ป้ายหาย">🗺️</span>
      <h1 className="mt-6 font-display text-3xl font-bold text-forest-900">404</h1>
      <p className="mt-2 text-base text-muted">ไม่พบหน้าที่คุณกำลังมองหา</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-[48px] items-center rounded-xl bg-forest-800 px-6 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
