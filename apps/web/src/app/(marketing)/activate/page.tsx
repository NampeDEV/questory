'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// FE-PAGE-ACTIVATE (SPEC-08)
export default function ActivatePage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError('กรุณากรอก Activation Code');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/activate-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (!res.ok) {
        const data: unknown = await res.json();
        const errObj = data !== null && typeof data === 'object' && 'error' in data
          ? (data as Record<string, unknown>).error
          : null;
        const errorCode =
          errObj !== null && typeof errObj === 'object' && 'code' in (errObj as Record<string, unknown>)
            ? String((errObj as Record<string, unknown>).code)
            : 'UNKNOWN_ERROR';

        if (errorCode === 'INVALID_CODE') {
          setError('Code ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
        } else {
          setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
        return;
      }

      router.push('/app/boards');
    } catch {
      setError('ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-800 text-white shadow-card">
          <QrCode size={28} aria-hidden="true" />
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-display text-2xl font-bold text-forest-900">
            Activate Your Quest
          </h1>
          <p className="mt-2 text-muted">
            กรอก Activation Code จาก QR Card ที่มากับบอร์ดของคุณ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card">
          <label htmlFor="activation-code" className="block text-sm font-semibold text-forest-900">
            Activation Code
          </label>
          <input
            id="activation-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="QST-XXXX-XXXX"
            className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-center font-mono text-lg tracking-widest text-ink placeholder:text-muted/50 focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            maxLength={20}
            autoComplete="off"
            aria-describedby={error ? 'activation-error' : undefined}
          />
          {error && (
            <p id="activation-error" className="mt-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            isLoading={isLoading}
          >
            เปิดใช้งาน Quest
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          ยังไม่มีบอร์ด?{' '}
          <Link href="/shop" className="font-medium text-forest-700 hover:underline">
            ซื้อบอร์ดได้ที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}
