'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lock, Package } from 'lucide-react';
import type { PinStatus, BadgeRarity } from '@/types/pin';

// FE-COMP-PIN-COLLECTION-GRID (SPEC-08) — TASK-012

export type PinWithStatus = {
  id: string;
  name: string;
  imageUrl: string;
  rarity: BadgeRarity;
  status: PinStatus;
};

const RARITY_RIM: Record<BadgeRarity, string> = {
  common:    'ring-1 ring-sand-300',
  uncommon:  'ring-2 ring-forest-500',
  rare:      'ring-2 ring-sky-400',
  epic:      'ring-2 ring-purple-500',
  legendary: 'ring-2 ring-gold-500',
};

const STATUS_FILTER_OPTIONS = [
  { value: 'all',             label: 'ทั้งหมด' },
  { value: 'unlocked',        label: 'ปลดล็อคแล้ว' },
  { value: 'claim_available', label: 'รอ Claim' },
  { value: 'claimed',         label: 'Claimed แล้ว' },
  { value: 'locked',          label: 'ล็อค' },
] as const;

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]['value'];

type PinCollectionGridProps = {
  pins: PinWithStatus[];
};

function PinTile({ pin }: { pin: PinWithStatus }) {
  const isLocked = pin.status === 'locked';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 ${RARITY_RIM[pin.rarity]} ${isLocked ? 'grayscale opacity-50' : ''}`}
      >
        <Image
          src={pin.imageUrl}
          alt={isLocked ? 'ล็อค' : pin.name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
            <Lock size={18} className="text-white" aria-label="ล็อค" />
          </div>
        )}
        {pin.status === 'claim_available' && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Claim
          </span>
        )}
        {pin.status === 'shipped' && (
          <Package size={14} className="absolute -bottom-1 right-0 text-forest-700" aria-label="จัดส่งแล้ว" />
        )}
      </div>
      <p className={`text-center text-[11px] font-medium leading-tight ${isLocked ? 'text-muted' : 'text-forest-900'}`}>
        {isLocked ? '???' : pin.name}
      </p>
    </div>
  );
}

export function PinCollectionGrid({ pins }: PinCollectionGridProps) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');

  const filtered = activeFilter === 'all'
    ? pins
    : pins.filter((p) => p.status === activeFilter);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === value
                ? 'bg-forest-800 text-white'
                : 'bg-sand-100 text-ink hover:bg-sand-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 py-10 text-center text-muted">
          <span className="text-3xl">🗺️</span>
          <p className="text-sm">ยังไม่มี Pin ในหมวดนี้</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
          {filtered.map((pin) => (
            <PinTile key={pin.id} pin={pin} />
          ))}
        </div>
      )}
    </div>
  );
}
