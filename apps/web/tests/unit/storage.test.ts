import { describe, it, expect } from 'vitest';
import { validatePhoto } from '@/lib/api/storage';

// TEST-001 — Unit tests for storage helpers

function makeFile(type: string, sizeBytes: number): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], 'test.jpg', { type });
}

describe('validatePhoto', () => {
  it('returns null for a valid JPEG within size limit', () => {
    const file = makeFile('image/jpeg', 1 * 1024 * 1024); // 1 MB
    expect(validatePhoto(file)).toBeNull();
  });

  it('returns null for a valid PNG within size limit', () => {
    const file = makeFile('image/png', 2 * 1024 * 1024); // 2 MB
    expect(validatePhoto(file)).toBeNull();
  });

  it('rejects files over 5 MB', () => {
    const file = makeFile('image/jpeg', 6 * 1024 * 1024); // 6 MB
    const result = validatePhoto(file);
    expect(result).not.toBeNull();
    expect(result).toContain('5 MB');
  });

  it('rejects unsupported MIME types (GIF)', () => {
    const file = makeFile('image/gif', 100 * 1024);
    const result = validatePhoto(file);
    expect(result).not.toBeNull();
    expect(result).toContain('JPEG');
  });

  it('rejects PDF uploads', () => {
    const file = makeFile('application/pdf', 100 * 1024);
    expect(validatePhoto(file)).not.toBeNull();
  });

  it('rejects exactly 5 MB + 1 byte over limit', () => {
    const file = makeFile('image/jpeg', 5 * 1024 * 1024 + 1);
    expect(validatePhoto(file)).not.toBeNull();
  });

  it('accepts exactly 5 MB (boundary)', () => {
    const file = makeFile('image/jpeg', 5 * 1024 * 1024);
    expect(validatePhoto(file)).toBeNull();
  });
});
