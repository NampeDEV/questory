import { describe, it, expect, beforeEach } from 'vitest';
import { getCreditsRemaining, checkCredits, deductCredits } from '@/lib/ai/credits';
import type { AIPlugin } from '@/lib/ai/credits';

// TEST-001 — Unit tests for AI credits ledger

// Reset ledger state between tests by using unique user IDs per test
let uid = 0;
function newUserId(): string {
  return `test-user-${++uid}`;
}

describe('getCreditsRemaining', () => {
  it('returns 1 for trip-planner (new user)', async () => {
    const userId = newUserId();
    expect(await getCreditsRemaining(userId, 'trip-planner')).toBe(1);
  });

  it('returns 3 for caption (new user)', async () => {
    const userId = newUserId();
    expect(await getCreditsRemaining(userId, 'caption')).toBe(3);
  });

  it('returns Infinity for unlimited plugins', async () => {
    const userId = newUserId();
    for (const plugin of ['memory-writer', 'checklist', 'recommend'] as AIPlugin[]) {
      expect(await getCreditsRemaining(userId, plugin)).toBe(Infinity);
    }
  });
});

describe('deductCredits', () => {
  it('decrements remaining credits on each call', async () => {
    const userId = newUserId();
    expect(await getCreditsRemaining(userId, 'caption')).toBe(3);
    await deductCredits(userId, 'caption');
    expect(await getCreditsRemaining(userId, 'caption')).toBe(2);
    await deductCredits(userId, 'caption');
    expect(await getCreditsRemaining(userId, 'caption')).toBe(1);
    await deductCredits(userId, 'caption');
    expect(await getCreditsRemaining(userId, 'caption')).toBe(0);
  });

  it('does not decrement below 0', async () => {
    const userId = newUserId();
    await deductCredits(userId, 'trip-planner'); // uses the 1 free
    await deductCredits(userId, 'trip-planner'); // no-op past zero
    expect(await getCreditsRemaining(userId, 'trip-planner')).toBe(0);
  });

  it('no-ops for unlimited plugins', async () => {
    const userId = newUserId();
    await deductCredits(userId, 'memory-writer');
    expect(await getCreditsRemaining(userId, 'memory-writer')).toBe(Infinity);
  });
});

describe('checkCredits', () => {
  it('resolves when credits remain', async () => {
    const userId = newUserId();
    await expect(checkCredits(userId, 'caption')).resolves.toBeUndefined();
  });

  it('throws RATE_LIMITED when no credits left', async () => {
    const userId = newUserId();
    // exhaust trip-planner (1 free)
    await deductCredits(userId, 'trip-planner');
    await expect(checkCredits(userId, 'trip-planner')).rejects.toThrow('RATE_LIMITED');
  });

  it('never throws for unlimited plugins regardless of usage', async () => {
    const userId = newUserId();
    for (let i = 0; i < 100; i++) await deductCredits(userId, 'checklist');
    await expect(checkCredits(userId, 'checklist')).resolves.toBeUndefined();
  });
});
