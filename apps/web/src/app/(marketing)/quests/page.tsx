import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Users, MapPin } from 'lucide-react';
import { getBoards } from '@/lib/api/boards';
import { BadgePill } from '@/components/ui/BadgePill';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Quests',
  description: 'ชุดภารกิจอุทยานแห่งชาติทั่วไทย ครอบคลุมทุกภูมิภาค',
};

const regionFilters = ['ทั้งหมด', 'เหนือ', 'กลาง', 'ใต้', 'อีสาน', 'ตะวันออก'] as const;
const difficultyFilters = ['ทุกระดับ', 'เริ่มต้น', 'ปานกลาง', 'ท้าทาย'] as const;

// Map board category → quest difficulty label
const difficultyMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  starter:  { label: 'เริ่มต้น',   variant: 'success' },
  regional: { label: 'ปานกลาง',   variant: 'warning' },
  ultimate: { label: 'ท้าทาย',    variant: 'danger' },
  custom:   { label: 'ปรับแต่งได้', variant: 'warning' },
};

// FE-PAGE-QUESTS (SPEC-08)
export default async function QuestsPage() {
  const boards = await getBoards();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero band */}
      <div className="relative overflow-hidden border-b border-forest-800/10 bg-forest-900 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950/70"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold text-white sm:text-5xl">
            Quest Catalogue
          </h1>
          <p className="mt-3 text-sand-200/70">ชุดภารกิจอุทยานทั่วไทย — เลือกตามภูมิภาคและระดับความยาก</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="กรองตามภูมิภาค">
            {regionFilters.map((label, i) => (
              <span
                key={label}
                className={`cursor-pointer rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-forest-800 text-white'
                    : 'border border-forest-700/30 text-ink hover:border-forest-700 hover:bg-sand-100'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-5 w-px bg-forest-800/20 hidden sm:block" aria-hidden="true" />
          <div className="flex flex-wrap gap-2" role="group" aria-label="กรองตามระดับความยาก">
            {difficultyFilters.map((label, i) => (
              <span
                key={label}
                className={`cursor-pointer rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'border border-forest-700/30 bg-sand-100 text-ink'
                    : 'border border-forest-700/30 text-ink hover:border-forest-700 hover:bg-sand-100'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Quest grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const diff = difficultyMap[board.category] ?? { label: 'ปานกลาง', variant: 'warning' as const };
            return (
              <Link
                key={board.id}
                href={`/quests/${board.slug}`}
                className="block"
                aria-label={`ดู Quest: ${board.name}`}
              >
                <Card hasHover className="overflow-hidden">
                  {/* Cover */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-forest-800">
                    <Image
                      src={board.coverImageUrl}
                      alt={board.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <BadgePill variant={diff.variant}>{diff.label}</BadgePill>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="font-serif text-lg font-bold text-forest-900 line-clamp-1">
                      {board.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted line-clamp-2">{board.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} aria-hidden="true" />
                        {board.questCount} อุทยาน
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} aria-hidden="true" />
                        ยอดนิยม
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA band */}
        <div className="mt-16 rounded-2xl bg-forest-900 p-8 text-center text-white">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            ยังไม่มีบอร์ด? เริ่มต้นได้ทันที
          </h2>
          <p className="mt-2 text-sand-200/70">ซื้อบอร์ดเพื่อปลดล็อก Quest ทั้งหมด</p>
          <Link
            href="/boards"
            className="mt-6 inline-flex h-[52px] items-center rounded-lg bg-gold-500 px-8 font-semibold text-forest-950 transition-colors hover:bg-gold-400"
          >
            ดูบอร์ดยอดนิยม
          </Link>
        </div>
      </div>
    </div>
  );
}
