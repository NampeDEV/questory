import { describe, it, expect } from 'vitest';
import { buildCacheKey, getCached, setCached } from '@/lib/ai/cache';

// TEST-001 — Unit tests for AI cache helpers

describe('buildCacheKey', () => {
  it('returns a 64-char hex SHA-256 string', () => {
    const key = buildCacheKey('caption', { parkName: 'Doi Inthanon' });
    expect(key).toMatch(/^[a-f0-9]{64}$/);
  });

  it('produces the same key for identical inputs', () => {
    const input = { parkName: 'Khao Yai', tone: 'fun' };
    expect(buildCacheKey('caption', input)).toBe(buildCacheKey('caption', input));
  });

  it('produces different keys for different plugins with same input', () => {
    const input = { parkName: 'Erawan' };
    expect(buildCacheKey('caption', input)).not.toBe(buildCacheKey('checklist', input));
  });

  it('produces different keys when input changes', () => {
    expect(buildCacheKey('caption', { parkName: 'A' })).not.toBe(buildCacheKey('caption', { parkName: 'B' }));
  });
});

describe('getCached / setCached', () => {
  it('returns null on a cache miss', () => {
    const key = buildCacheKey('test', { id: Math.random() });
    expect(getCached(key)).toBeNull();
  });

  it('returns stored value after setCached', () => {
    const key = buildCacheKey('test', { id: 'static-test' });
    const value = { result: 'hello' };
    setCached(key, value);
    expect(getCached(key)).toEqual(value);
  });

  it('overwrites existing value on second set', () => {
    const key = buildCacheKey('overwrite', { id: 'overwrite-test' });
    setCached(key, { v: 1 });
    setCached(key, { v: 2 });
    expect(getCached<{ v: number }>(key)?.v).toBe(2);
  });
});
