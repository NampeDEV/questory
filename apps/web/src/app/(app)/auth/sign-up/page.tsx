'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

// Auth sign-up page (SPEC-08 · S-011c)
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
        <div className="w-full max-w-sm text-center">
          <span className="text-5xl">✉️</span>
          <h1 className="mt-4 font-display text-xl font-bold text-forest-900">ตรวจสอบอีเมล</h1>
          <p className="mt-2 text-sm text-muted">
            เราส่งลิงก์ยืนยันไปที่ <strong>{email}</strong> แล้ว — กรุณาเช็กอีเมลและกดยืนยันก่อนเข้าสู่ระบบ
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-6 inline-block font-medium text-forest-700 hover:underline"
          >
            ไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-bold text-forest-900">
            <span className="text-gold-500">⬡</span> Questory
          </Link>
          <h1 className="mt-4 text-xl font-bold text-forest-900">สมัครสมาชิก</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-forest-900">
              ชื่อที่แสดง
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>
          <div className="mt-4">
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
              autoComplete="new-password"
              minLength={8}
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
            <p className="mt-1 text-xs text-muted">อย่างน้อย 8 ตัวอักษร</p>
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
            สมัครสมาชิก
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          มีบัญชีแล้ว?{' '}
          <Link href="/auth/sign-in" className="font-medium text-forest-700 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
