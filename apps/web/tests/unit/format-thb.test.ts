import { describe, expect, it } from 'vitest';
import { formatThb } from '../../src/lib/utils/format-thb';

describe('formatThb', () => {
  it('formats integer amount in Thai locale style', () => {
    expect(formatThb(1490)).toBe('1,490 ฿');
  });

  it('handles zero and negative values', () => {
    expect(formatThb(0)).toBe('0 ฿');
    expect(formatThb(-250)).toBe('-250 ฿');
  });
});
