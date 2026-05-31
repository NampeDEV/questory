import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

const AdminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(256),
  redirectPath: z.string().optional(),
});

function normalizeRedirectPath(path: string | undefined): string {
  if (!path) {
    return '/admin';
  }

  return path.startsWith('/admin') ? path : '/admin';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  const parsed = AdminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 422 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'CONFIG_MISSING' }, { status: 503 });
  }

  const isValidEmail = parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
  const isValidPassword = parsed.data.password === adminPassword;

  if (!isValidEmail || !isValidPassword) {
    return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const redirectPath = normalizeRedirectPath(parsed.data.redirectPath);
  const response = NextResponse.json({ ok: true, redirectPath }, { status: 200 });

  // Security: admin access cookie is HttpOnly and not readable by client scripts.
  response.cookies.set({
    name: 'mock_admin',
    value: 'true',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}