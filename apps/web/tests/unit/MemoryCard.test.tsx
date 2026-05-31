// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryCard } from '../../src/components/sections/MemoryCard';

afterEach(() => { cleanup(); });

// TEST-002 — MemoryCard component
describe('MemoryCard', () => {
  it('renders title and body text', () => {
    render(
      <MemoryCard
        title="ยอดดอยสูงสุด"
        body="วิวสวยมาก ลมแรงมาก อุณหภูมิต่ำ"
      />
    );
    expect(screen.getByText('ยอดดอยสูงสุด')).toBeTruthy();
    expect(screen.getByText('วิวสวยมาก ลมแรงมาก อุณหภูมิต่ำ')).toBeTruthy();
  });

  it('renders parkName and date when provided', () => {
    render(
      <MemoryCard
        title="Memory"
        body="body"
        parkName="ดอยอินทนนท์"
        date="2026-05-30"
      />
    );
    expect(screen.getByText('ดอยอินทนนท์')).toBeTruthy();
    expect(screen.getByText('2026-05-30')).toBeTruthy();
  });

  it('shows badge label when provided', () => {
    render(
      <MemoryCard
        title="Memory"
        body="body"
        badgeLabel="Explorer"
      />
    );
    expect(screen.getByText('Explorer')).toBeTruthy();
  });

  it('does not render an img when no photoUrl provided', () => {
    const { container } = render(<MemoryCard title="T" body="b" />);
    expect(container.querySelector('img')).toBeNull();
  });
});
