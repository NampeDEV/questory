import Image from 'next/image';
import { Lock } from 'lucide-react';
import type { BadgeRarity } from '@/types/pin';

// FE-COMP-BADGE-PIN-CARD (SPEC-08) — TASK-008

const RARITY_RIM: Record<BadgeRarity, string> = {
  common:     'ring-1 ring-sand-300',
  uncommon:   'ring-2 ring-forest-500',
  rare:       'ring-2 ring-sky-400',
  epic:       'ring-2 ring-purple-500',
  legendary:  'ring-2 ring-gold-500',
};

type BadgePinCardProps = {
  name: string;
  imageUrl: string;
  rarity: BadgeRarity;
  status: 'locked' | 'unlocked' | 'claim_available';
};

export function BadgePinCard({ name, imageUrl, rarity, status }: BadgePinCardProps) {
  const isLocked = status === 'locked';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 ${RARITY_RIM[rarity]} ${isLocked ? 'grayscale opacity-50' : ''}`}
      >
        <Image
          src={imageUrl}
          alt={isLocked ? 'ล็อค' : name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
            <Lock size={20} className="text-white" aria-label="ล็อค" />
          </div>
        )}
        {status === 'claim_available' && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Claim
          </span>
        )}
      </div>
      <p className={`text-center text-xs font-medium ${isLocked ? 'text-muted' : 'text-forest-900'}`}>
        {isLocked ? '???' : name}
      </p>
    </div>
  );
}
