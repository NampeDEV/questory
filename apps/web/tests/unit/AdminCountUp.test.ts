import { describe, expect, it } from 'vitest';
import { parseNumeric } from '../../src/components/admin/AdminCountUp';

describe('parseNumeric', () => {
  it('extracts currency prefix and numeric amount', () => {
    expect(parseNumeric('฿128,450')).toEqual({
      prefix: '฿',
      numeric: 128450,
      suffix: '',
    });
  });

  it('keeps suffix content when provided', () => {
    expect(parseNumeric('+1,234 pts')).toEqual({
      prefix: '+',
      numeric: 1234,
      suffix: ' pts',
    });
  });
});
