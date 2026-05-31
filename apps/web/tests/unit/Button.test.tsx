// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders with selected variant class', () => {
    render(<Button variant="gold">Start</Button>);
    const button = screen.getByRole('button', { name: 'Start' });
    expect(button.className).toContain('bg-gold-500');
  });

  it('disables button while isLoading is true', () => {
    render(<Button isLoading>Saving</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveProperty('disabled', true);
  });
});
