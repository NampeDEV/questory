import { describe, it, expect } from 'vitest';
import { ApiError, apiSuccess, apiError, handleRouteError } from '@/lib/api/response';

// TEST-001 — Unit tests for api/response helpers
describe('ApiError', () => {
  it('constructs with code, statusCode, message', () => {
    const err = new ApiError('UNAUTHORIZED', 401, 'Not logged in');
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Not logged in');
    expect(err.name).toBe('ApiError');
  });

  it('optionally carries details payload', () => {
    const details = { field: 'email' };
    const err = new ApiError('INVALID_INPUT', 422, 'Validation failed', details);
    expect(err.details).toEqual(details);
  });
});

describe('apiSuccess', () => {
  it('returns 200 with data envelope by default', async () => {
    const res = apiSuccess({ foo: 'bar' });
    expect(res.status).toBe(200);
    const body = await res.json() as { data: { foo: string } };
    expect(body.data).toEqual({ foo: 'bar' });
  });

  it('returns custom status code when provided', async () => {
    const res = apiSuccess({ id: 'new-001' }, 201);
    expect(res.status).toBe(201);
    const body = await res.json() as { data: { id: string } };
    expect(body.data.id).toBe('new-001');
  });
});

describe('apiError', () => {
  it('returns error envelope with code and message', async () => {
    const res = apiError('NOT_FOUND', 'Resource not found', 404);
    expect(res.status).toBe(404);
    const body = await res.json() as { error: { code: string; message: string; details: unknown } };
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe('Resource not found');
    expect(body.error.details).toBeUndefined();
  });

  it('includes details when provided', async () => {
    const details = { fieldErrors: { email: ['invalid'] } };
    const res = apiError('INVALID_INPUT', 'Bad input', 422, details);
    const body = await res.json() as { error: { details: unknown } };
    expect(body.error.details).toEqual(details);
  });
});

describe('handleRouteError', () => {
  it('converts ApiError to the corresponding HTTP response', async () => {
    const err = new ApiError('FORBIDDEN', 403, 'Access denied');
    const res = handleRouteError(err);
    expect(res.status).toBe(403);
    const body = await res.json() as { error: { code: string } };
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('converts unknown errors to 500 INTERNAL_ERROR', async () => {
    const res = handleRouteError(new Error('boom'));
    expect(res.status).toBe(500);
    const body = await res.json() as { error: { code: string } };
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('handles non-Error objects gracefully', async () => {
    const res = handleRouteError('something went wrong');
    expect(res.status).toBe(500);
    const body = await res.json() as { error: { code: string } };
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
