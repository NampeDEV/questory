'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

// Auth sign-in page (SPEC-08 · S-011b)
// useSearchParams requires Suspense boundary per Next.js 15 rules.
export const dynamic = 'force-dynamic';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      setIsLoading(false);
      return;
    }

    const redirect = searchParams.get('redirect') ?? '/app';
    router.push(redirect);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-bold text-forest-900">
            <span className="text-gold-500">⬡</span> Questory
          </Link>
          <h1 className="mt-4 text-xl font-bold text-forest-900">เข้าสู่ระบบ</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-forest-900">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-semibold text-forest-900">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>
          {error && (
            <p className="mt-4 rounded-lg bg-danger/5 px-4 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-4 w-full"
            isLoading={isLoading}
          >
            เข้าสู่ระบบ
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          ยังไม่มีบัญชี?{' '}
          <Link href="/auth/sign-up" className="font-medium text-forest-700 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

