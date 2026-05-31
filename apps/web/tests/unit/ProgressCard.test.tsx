// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ProgressCard } from '../../src/components/ui/ProgressCard';

afterEach(() => { cleanup(); });

// TEST-002 — ProgressCard component
describe('ProgressCard', () => {
  it('renders title and progress text', () => {
    render(<ProgressCard title="ดอยอินทนนท์" completed={3} total={5} />);
    expect(screen.getByText('ดอยอินทนนท์')).toBeTruthy();
    expect(screen.getByText('3 / 5 ภารกิจ')).toBeTruthy();
  });

  it('uses custom label when provided', () => {
    render(<ProgressCard title="Board" completed={1} total={4} label="เสร็จแล้ว" />);
    expect(screen.getByText('1 / 4 เสร็จแล้ว')).toBeTruthy();
  });

  it('renders as a plain div when no href', () => {
    const { container } = render(<ProgressCard title="T" completed={1} total={2} />);
    expect(container.querySelector('a')).toBeNull();
  });

  it('renders as a link when href is provided', () => {
    render(<ProgressCard title="T" completed={1} total={2} href="/boards/1" />);
    const link = screen.getByRole('link');
    expect((link as HTMLAnchorElement).href).toContain('/boards/1');
  });
});
