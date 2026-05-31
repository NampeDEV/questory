import { afterEach, describe, expect, it, vi } from 'vitest';
import { analytics, track } from '../../src/lib/utils/analytics';

describe('analytics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters blocked PII keys from tracked properties', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    track('add_to_cart', {
      product: 'starter',
      quantity: 1,
      email: 'secret@example.com',
      token: 'abc',
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const thirdArg = infoSpy.mock.calls[0]?.[2] as Record<string, unknown>;
    expect(thirdArg.product).toBe('starter');
    expect(thirdArg.quantity).toBe(1);
    expect(thirdArg.email).toBeUndefined();
    expect(thirdArg.token).toBeUndefined();
  });

  it('helper API sends expected event payload', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    analytics.startQuestClick('hero');

    expect(infoSpy).toHaveBeenCalledWith('[Analytics]', 'start_quest_click', { source: 'hero' });
  });
});
