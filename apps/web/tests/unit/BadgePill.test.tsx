// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BadgePill } from '../../src/components/ui/BadgePill';

describe('BadgePill', () => {
  it('renders child label text', () => {
    render(<BadgePill variant="rare">Rare Pin</BadgePill>);
    expect(screen.getByText('Rare Pin')).toBeTruthy();
  });

  it('applies rarity classes', () => {
    render(<BadgePill variant="legendary">Legend</BadgePill>);
    const badge = screen.getByText('Legend');
    expect(badge.className).toContain('from-gold-500');
  });
});
