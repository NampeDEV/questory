import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// S-011d — OAuth / magic-link callback handler.
// Supabase redirects here after email confirmation or Google OAuth.
// Exchanges the code for a session and redirects to the app.

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/sign-in?error=missing_code`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_callback_failed`);
  }

  // Ensure redirect stays within our domain
  const safeNext = next.startsWith('/') ? next : '/app';
  return NextResponse.redirect(`${origin}${safeNext}`);
}
