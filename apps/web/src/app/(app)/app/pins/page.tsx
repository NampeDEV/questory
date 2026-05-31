import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Package } from 'lucide-react';
import { getUserPins, getPinClaims } from '@/lib/api/pins';
import { BadgePill } from '@/components/ui/BadgePill';
import { pinStatusStyle } from '@/lib/utils/status-style';

export const metadata: Metadata = {
  title: 'My Pins',
  description: 'Pin สะสมของคุณจากภารกิจอุทยาน',
};

const rarityVariant: Record<string, 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
};

const categoryFilters = ['ทั้งหมด', '⛰️ ภูเขา', '💧 น้ำตก', '🌊 ทะเล', '🌿 ป่า'] as const;
const rarityFilters = ['ทุก Rarity', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as const;

// FE-PAGE-PINS (SPEC-08)
export default async function PinsPage() {
  const [pins, claims] = await Promise.all([getUserPins(), getPinClaims()]);

  const total    = pins.length;
  const common   = pins.filter((p) => p.rarity === 'common').length;
  const rare     = pins.filter((p) => p.rarity === 'rare' || p.rarity === 'epic').length;
  const legendary = pins.filter((p) => p.rarity === 'legendary').length;
  const unlocked = pins.filter((p) => p.status !== 'locked').length;

  const latestClaim = claims[0];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-forest-900">Pin Collection</h1>
        <p className="mt-1 text-sm text-muted">ปลดล็อกแล้ว {unlocked} / {total} ชิ้น</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'ทั้งหมด', value: total,    color: 'text-forest-900' },
          { label: 'Common',  value: common,   color: 'text-moss-500' },
          { label: 'Rare+',   value: rare,     color: 'text-gold-500' },
          { label: 'Legendary', value: legendary, color: 'text-[#7B5BA6]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-forest-800/10 bg-white/70 p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-muted leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Latest claim status */}
      {latestClaim && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-forest-800/10 bg-white/70 p-4">
          <Package size={20} className="flex-shrink-0 text-forest-700" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-forest-900">สถานะการจัดส่ง</p>
            <p className="text-xs text-muted">Claim #{latestClaim.id}</p>
          </div>
          <span className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold ${pinStatusStyle[latestClaim.status].className}`}>
            {pinStatusStyle[latestClaim.status].label}
          </span>
        </div>
      )}

      {/* Filter row */}
      <div className="mt-5 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="กรองตามหมวด">
          {categoryFilters.map((f, i) => (
            <span
              key={f}
              className={`flex-shrink-0 cursor-pointer rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                i === 0
                  ? 'bg-forest-800 text-white'
                  : 'border border-forest-700/30 text-ink hover:bg-sand-100'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="กรองตาม Rarity">
          {rarityFilters.map((f, i) => (
            <span
              key={f}
              className={`flex-shrink-0 cursor-pointer rounded-pill px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                i === 0
                  ? 'border border-forest-700/30 bg-sand-100 text-ink'
                  : 'border border-forest-700/30 text-ink hover:bg-sand-100'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Latest unlocked spotlight */}
      {(() => {
        const spotlight = pins.find((p) => p.status === 'claim_available');
        if (!spotlight) return null;
        return (
          <div className="mt-5 rounded-2xl border-2 border-gold-500/40 bg-gold-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-500">🎉 Claim ได้แล้ว!</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-forest-800">
                <Image src={spotlight.imageUrl} alt={spotlight.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-forest-900">{spotlight.name}</p>
                <BadgePill variant={rarityVariant[spotlight.rarity]}>{spotlight.rarity}</BadgePill>
              </div>
              <Link
                href="/app/pins"
                className="flex-shrink-0 rounded-lg bg-gold-500 px-3 py-2 text-xs font-bold text-forest-950 hover:bg-gold-400"
              >
                Claim
              </Link>
            </div>
          </div>
        );
      })()}

      {/* Pin grid */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {pins.map((pin) => {
          const isLocked = pin.status === 'locked';
          return (
            <div key={pin.id} className="relative">
              <div
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                  isLocked
                    ? 'border-sand-200 bg-sand-100 opacity-50'
                    : pin.rarity === 'legendary'
                    ? 'border-gold-500 shadow-badge'
                    : pin.rarity === 'epic'
                    ? 'border-[#7B5BA6]/60'
                    : pin.rarity === 'rare'
                    ? 'border-gold-500/50'
                    : 'border-forest-800/10'
                }`}
              >
                {isLocked ? (
                  <div className="flex h-full w-full items-center justify-center bg-forest-950/10">
                    <Lock size={20} className="text-muted" aria-hidden="true" />
                  </div>
                ) : (
                  <Image
                    src={pin.imageUrl}
                    alt={pin.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 160px"
                  />
                )}
              </div>
              {/* Status chip */}
              {!isLocked && (
                <div className="mt-1 text-center">
                  <span className={`inline-flex items-center rounded-pill px-1.5 py-0.5 text-[10px] font-semibold ${pinStatusStyle[pin.status].className}`}>
                    {pinStatusStyle[pin.status].label}
                  </span>
                </div>
              )}
              <p className="mt-1 text-center text-[11px] text-muted line-clamp-1">{pin.name}</p>
            </div>
          );
        })}
      </div>

      {/* Empty state hint */}
      {unlocked === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-forest-700/30 p-8 text-center">
          <p className="text-sm text-muted">ส่งหลักฐานเพื่อปลดล็อก Pin แรกของคุณ</p>
          <Link
            href="/app/boards"
            className="mt-3 inline-flex h-[40px] items-center rounded-lg bg-forest-800 px-5 text-sm font-semibold text-white hover:bg-forest-700"
          >
            ดูบอร์ด
          </Link>
        </div>
      )}
    </div>
  );
}
