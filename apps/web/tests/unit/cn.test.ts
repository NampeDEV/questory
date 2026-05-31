import { describe, expect, it } from 'vitest';
import { cn } from '../../src/lib/utils/cn';

describe('cn', () => {
  it('merges truthy classes and removes falsy entries', () => {
    const result = cn('px-2', false && 'hidden', undefined, 'py-1');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).not.toContain('hidden');
  });

  it('merges tailwind conflicts by keeping the latter class', () => {
    const result = cn('text-sm', 'text-lg', 'font-medium');
    expect(result).toContain('text-lg');
    expect(result).not.toContain('text-sm');
    expect(result).toContain('font-medium');
  });
});
