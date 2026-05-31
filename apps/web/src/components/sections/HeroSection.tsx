import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroCTAButtons } from '@/components/sections/HeroCTAButtons';

// FE-COMP-HERO (SPEC-08) — AC-LANDING-002

const BULLETS = [
  'Quests in all 77 provinces',
  'Copy proven travel plans',
  'Collect pins and track achievements',
  'Your memories forever saved',
] as const;

const previewBadges = [
  { id: 1, emoji: '⛰️', locked: false },
  { id: 2, emoji: '🌊', locked: false },
  { id: 3, emoji: '🌿', locked: false },
  { id: 4, emoji: '🦅', locked: false },
  { id: 5, emoji: '⬡',  locked: true },
  { id: 6, emoji: '⬡',  locked: true },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[580px] overflow-hidden bg-forest-950 lg:min-h-[640px]">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/images/hero/hero-main.jpg')" }}
        aria-hidden="true"
      />
      {/* Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-950/50 to-forest-950/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        {/* ── Left: headline + CTAs + bullets ── */}
        <div className="animate-fade-in-up">
          <h1 className="font-display text-[40px] font-bold leading-[1.15] text-white sm:text-5xl lg:text-[54px]">
            Turn Every Journey<br />into an Achievement
          </h1>
          <p className="mt-4 text-base leading-relaxed text-sand-200/80 lg:text-lg">
            ออกเดินทาง เก็บภารกิจ สร้างความทรงจำ และสะสม Pin จากอุทยานไทย
          </p>

          {/* CTAs — AC-LANDING-002 + analytics (AC-LANDING-009) */}
          <HeroCTAButtons />

          {/* Feature bullets — AC-LANDING-002 */}
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <CheckCircle size={16} className="flex-shrink-0 text-gold-400" aria-hidden="true" />
                <span className="text-sm text-sand-200/90">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: board preview card ── */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-2xl">
            {/* Member avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['C', 'A', 'B'].map((l) => (
                  <div
                    key={l}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-forest-700 text-[10px] font-bold text-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted">สมาชิกกำลังทำภารกิจนี้</p>
            </div>

            {/* Board name */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">⛰️</span>
              <h2 className="font-display text-xl font-bold text-forest-900">15 ดอยไทย</h2>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] text-muted">ความคืบหน้าโดยรวม</p>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-sand-200"
                role="progressbar"
                aria-valuenow={23}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="ความคืบหน้า 23%"
              >
                <div className="h-full w-[23%] rounded-full bg-gold-500" />
              </div>
              <p className="mt-1 text-right text-[11px] text-muted">3,456 / 15,000 Missions</p>
            </div>

            {/* Badges */}
            <div className="mt-4 flex gap-2">
              {previewBadges.map((b) => (
                <div
                  key={b.id}
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-base',
                    b.locked
                      ? 'border-sand-200 bg-sand-100 opacity-40'
                      : 'border-gold-300 bg-gold-50',
                  ].join(' ')}
                  aria-label={b.locked ? 'ยังไม่ปลดล็อก' : 'ปลดล็อกแล้ว'}
                >
                  {b.emoji}
                </div>
              ))}
            </div>

            {/* Card actions */}
            <div className="mt-5 flex gap-2">
              <Button variant="primary" size="sm" className="flex-1" asChild>
                <Link href="/activate">Start This Board</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 border border-forest-800/20"
                asChild
              >
                <Link href="/boards">ดูรายละเอียด</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
