'use client';

import { useState } from 'react';
import { BoardProductCard } from '@/components/sections/BoardProductCard';
import type { BoardTemplate, BoardCategory } from '@/types/board';

// FE-COMP-BOARD-FILTER-BAR (SPEC-08) — TASK-013

const FILTER_OPTIONS: { value: 'all' | BoardCategory; label: string }[] = [
  { value: 'all',      label: 'ทั้งหมด' },
  { value: 'starter',  label: 'Starter' },
  { value: 'regional', label: 'Regional' },
  { value: 'ultimate', label: 'Ultimate' },
  { value: 'custom',   label: 'Custom' },
];

type BoardFilterBarProps = {
  boards: BoardTemplate[];
};

export function BoardFilterBar({ boards }: BoardFilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | BoardCategory>('all');

  const filtered = activeFilter === 'all'
    ? boards
    : boards.filter((b) => b.category === activeFilter);

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="กรองตามประเภทบอร์ด">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === value
                ? 'border border-forest-800 bg-forest-800 text-white'
                : 'border border-forest-700/30 bg-white text-ink hover:border-forest-700 hover:bg-sand-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Board grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((board) => (
          <BoardProductCard key={board.id} board={board} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">ไม่พบบอร์ดในหมวดนี้</p>
      )}
    </>
  );
}
