import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Award, Users, Clock } from 'lucide-react';
import { getBoardBySlug } from '@/lib/api/boards';
import { getMissions } from '@/lib/api/missions';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatThb } from '@/lib/utils/format-thb';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return { title: 'Quest not found' };
  return { title: `Quest: ${board.name}`, description: board.description };
}

const difficultyLabel: Record<string, string> = {
  starter: 'เริ่มต้น',
  regional: 'ปานกลาง',
  ultimate: 'ท้าทาย',
  custom: 'ปรับแต่งได้',
};

const difficultyVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  starter: 'success',
  regional: 'warning',
  ultimate: 'danger',
  custom: 'warning',
};

const categoryLabel: Record<string, string> = {
  mountain: '⛰️ ภูเขา',
  waterfall: '💧 น้ำตก',
  marine: '🌊 ทะเล',
  forest: '🌿 ป่า',
};

// FE-PAGE-QUEST-DETAIL (SPEC-08)
export default async function QuestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [board, missions] = await Promise.all([
    getBoardBySlug(slug),
    getMissions(),
  ]);
  if (!board) notFound();

  const boardMissions = missions.filter((m) => m.boardTemplateId === board.id);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero */}
      <div className="relative h-[360px] overflow-hidden bg-forest-900 lg:h-[460px]">
        <Image
          src={board.coverImageUrl}
          alt={board.name}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-wrap gap-2">
              <BadgePill variant={difficultyVariant[board.category]}>
                {difficultyLabel[board.category]}
              </BadgePill>
              <BadgePill variant="default">
                <MapPin size={12} className="mr-1" aria-hidden="true" />
                {board.questCount} อุทยาน
              </BadgePill>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-white lg:text-5xl">
              {board.name}
            </h1>
            <p className="mt-2 max-w-xl text-sand-200/80">{board.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main — mission list */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-forest-900">
              ภารกิจทั้งหมด ({boardMissions.length > 0 ? boardMissions.length : board.questCount})
            </h2>

            {boardMissions.length > 0 ? (
              <div className="mt-4 space-y-4">
                {boardMissions.map((mission, idx) => (
                  <Card key={mission.id} className="flex gap-4 p-4">
                    <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-forest-800">
                      <Image
                        src={mission.coverImageUrl}
                        alt={mission.parkName}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-muted">#{idx + 1}</span>
                        <BadgePill variant="default" className="flex-shrink-0">
                          {categoryLabel[mission.category]}
                        </BadgePill>
                      </div>
                      <h3 className="mt-1 font-semibold text-forest-900 line-clamp-1">
                        {mission.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted line-clamp-2">
                        {mission.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {Array.from({ length: board.questCount }).map((_, i) => (
                  <Card key={i} className="flex items-center gap-4 p-4 opacity-60">
                    <div className="h-14 w-20 flex-shrink-0 rounded-lg bg-sand-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-sand-200" />
                      <div className="h-3 w-2/3 rounded bg-sand-200" />
                    </div>
                    <span className="text-sm text-muted">ภารกิจที่ {i + 1}</span>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card">
              <div className="text-center">
                <p className="text-3xl font-bold text-forest-800">{formatThb(board.priceThb)}</p>
                <p className="mt-1 text-sm text-muted">รวม {board.questCount} ภารกิจ</p>
              </div>
              <div className="mt-5 space-y-3">
                <Button variant="gold" className="w-full" asChild>
                  <Link href={`/shop`}>ซื้อตอนนี้</Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/boards/${board.slug}`}>ดูรายละเอียดบอร์ด</Link>
                </Button>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <Award size={15} className="text-gold-500" aria-hidden="true" />
                  รับ Badge ดิจิตอลทุกภารกิจ
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="text-gold-500" aria-hidden="true" />
                  ติดตามภารกิจในแอป
                </li>
                <li className="flex items-center gap-2">
                  <Users size={15} className="text-gold-500" aria-hidden="true" />
                  Claim Pin จริงหลังผ่านภารกิจ
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={15} className="text-gold-500" aria-hidden="true" />
                  ไม่มีวันหมดอายุ
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl bg-forest-900 p-8 text-center text-white">
          <h2 className="font-display text-xl font-bold">ดูบอร์ดยอดนิยมเพิ่มเติม</h2>
          <p className="mt-2 text-sand-200/70">ค้นหาบอร์ดที่เหมาะกับสไตล์การเดินทางของคุณ</p>
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
