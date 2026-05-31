'use client';

import { useState } from 'react';
import { PlanCard } from '@/components/sections/PlanCard';
import type { Plan } from '@/types/plan';

// FE-COMP-PLAN-FILTER-BAR (SPEC-08) — TASK-014

const REGION_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',       label: 'ทั้งหมด' },
  { value: 'north',     label: 'เหนือ' },
  { value: 'central',   label: 'กลาง' },
  { value: 'south',     label: 'ใต้' },
  { value: 'northeast', label: 'อีสาน' },
  { value: 'east',      label: 'ตะวันออก' },
];

type PlanFilterBarProps = {
  plans: Plan[];
};

export function PlanFilterBar({ plans }: PlanFilterBarProps) {
  const [activeRegion, setActiveRegion] = useState('all');

  const filtered = activeRegion === 'all'
    ? plans
    : plans.filter((p) => p.region === activeRegion);

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="กรองแผน">
        {REGION_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveRegion(value)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
              activeRegion === value
                ? 'border border-forest-800 bg-forest-800 text-white'
                : 'border border-forest-700/30 bg-parchment text-ink hover:border-forest-700 hover:bg-sand-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Plans grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">ไม่พบแผนสำหรับภูมิภาคนี้</p>
      )}
    </>
  );
}
