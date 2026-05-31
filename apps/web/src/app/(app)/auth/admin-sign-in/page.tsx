'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';

function normalizeRedirectPath(path: string | null): string {
  if (!path) {
    return '/admin';
  }

  return path.startsWith('/admin') ? path : '/admin';
}

function AdminSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = useMemo(() => normalizeRedirectPath(searchParams.get('redirect')), [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          redirectPath,
        }),
      });

      const data: unknown = await response.json();
      const maybeResponse =
        typeof data === 'object' && data !== null ? (data as { error?: string; redirectPath?: string }) : undefined;

      if (!response.ok) {
        if (maybeResponse?.error === 'CONFIG_MISSING') {
          setErrorMessage('ยังไม่ได้ตั้งค่า ADMIN_EMAIL และ ADMIN_PASSWORD ในระบบ');
        } else {
          setErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        return;
      }

      const nextPath = normalizeRedirectPath(maybeResponse?.redirectPath ?? redirectPath);
      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-bold text-forest-900">
            <span className="text-gold-500">⬡</span> Questory Admin
          </Link>
          <h1 className="mt-4 text-xl font-bold text-forest-900">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="mt-1 text-sm text-muted">สำหรับทีมแอดมินเท่านั้น</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card"
        >
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-forest-900">
              อีเมลแอดมิน
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="admin-password" className="block text-sm font-semibold text-forest-900">
              รหัสผ่าน
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>

          {errorMessage ? (
            <p className="mt-3 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            isLoading={isLoading}
          >
            เข้าสู่ระบบแอดมิน
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          เข้าระบบผู้ใช้งานทั่วไป?{' '}
          <Link href="/auth/sign-in" className="font-medium text-forest-700 hover:underline">
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInForm />
    </Suspense>
  );
}