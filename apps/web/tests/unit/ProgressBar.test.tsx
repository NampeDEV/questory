// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../../src/components/ui/ProgressBar';

describe('ProgressBar', () => {
  it('renders the label and progress element', () => {
    render(<ProgressBar value={5} max={10} label="5 / 10" />);

    expect(screen.getByText('5 / 10')).toBeTruthy();
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('clamps width to 100 when value exceeds max', () => {
    const { container } = render(<ProgressBar value={120} max={100} label="120 / 100" />);
    const fill = container.querySelector('[style*="width"]') as HTMLDivElement | null;
    expect(fill?.style.width).toBe('100%');
  });
});
