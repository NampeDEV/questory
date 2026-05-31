import { NextResponse } from 'next/server';

// API-ENVELOPE (SPEC-07) — success / error envelope + typed error codes.

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'ALREADY_ACTIVATED'
  | 'INVALID_CODE'
  | 'DUPLICATE_SUBMISSION'
  | 'SAFETY_NOT_ACKNOWLEDGED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

/**
 * Throw this inside a Route Handler; catch it at the top-level try/catch and
 * convert with `apiError()`.
 */
export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** `{ data: T }` — 200 by default. Pass 201 for creates. */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/** `{ error: { code, message, details? } }` */
export function apiError(
  code: ErrorCode,
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

/**
 * Call inside a route handler's catch block:
 *
 * ```ts
 * } catch (err) {
 *   return handleRouteError(err);
 * }
 * ```
 */
export function handleRouteError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return apiError(err.code, err.message, err.statusCode, err.details);
  }
  console.error('[route-error]', err);
  return apiError('INTERNAL_ERROR', 'An unexpected error occurred.', 500);
}
