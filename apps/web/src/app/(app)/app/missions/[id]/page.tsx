import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Flame, Lock } from 'lucide-react';
import { getMissionById, getUserMissionStatuses } from '@/lib/api/missions';
import { getBadges } from '@/lib/api/pins';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { missionStatusStyle } from '@/lib/utils/status-style';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const mission = await getMissionById(id);
  if (!mission) return { title: 'Mission not found' };
  return { title: mission.name, description: mission.description };
}

const regionLabel: Record<string, string> = {
  north: 'ภาคเหนือ',
  central: 'ภาคกลาง',
  northeast: 'ภาคอีสาน',
  east: 'ภาคตะวันออก',
  south: 'ภาคใต้',
};

const difficultyLabel: Record<string, string> = {
  easy: 'เริ่มต้น',
  medium: 'ปานกลาง',
  hard: 'ท้าทาย',
};

const difficultyVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
};

const categoryLabel: Record<string, string> = {
  mountain: '⛰️ ภูเขา',
  waterfall: '💧 น้ำตก',
  marine: '🌊 ทะเล',
  forest: '🌿 ป่า',
};

// FE-PAGE-MISSION-DETAIL (SPEC-08)
export default async function MissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [mission, statuses, allBadges] = await Promise.all([
    getMissionById(id),
    getUserMissionStatuses(),
    getBadges(),
  ]);
  if (!mission) notFound();

  const userStatus = statuses.find((s) => s.missionId === id)?.status ?? 'locked';
  const statusStyle = missionStatusStyle[userStatus];
  const rewardBadge = allBadges.find((b) => b.id === mission.rewardBadgeId);
  const canSubmit = userStatus === 'available' || userStatus === 'need_more_info';

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Cover */}
      <div className="relative h-56 overflow-hidden rounded-2xl bg-forest-800">
        <Image
          src={mission.coverImageUrl}
          alt={mission.parkName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <span className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${statusStyle.className}`}>
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* Metadata pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        <BadgePill variant="default">
          <MapPin size={12} className="mr-1" aria-hidden="true" />
          {regionLabel[mission.region]}
        </BadgePill>
        <BadgePill variant={difficultyVariant[mission.difficulty]}>
          <Flame size={12} className="mr-1" aria-hidden="true" />
          {difficultyLabel[mission.difficulty]}
        </BadgePill>
        <BadgePill variant="default">{categoryLabel[mission.category]}</BadgePill>
      </div>

      {/* Title + park */}
      <div className="mt-3">
        <p className="text-sm font-medium text-muted">{mission.parkName}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-forest-900 leading-tight">
          {mission.name}
        </h1>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-ink">{mission.description}</p>

      {/* Reward pin preview */}
      {rewardBadge && (
        <div className="mt-6 rounded-2xl border border-forest-800/10 bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">รางวัล</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-gold-500/40 bg-forest-800">
              {userStatus === 'completed' || userStatus === 'approved' ? (
                <Image
                  src={rewardBadge.imageUrl}
                  alt={rewardBadge.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest-950/40">
                  <Lock size={16} className="text-sand-200" aria-hidden="true" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-forest-900">{rewardBadge.name}</p>
              <BadgePill variant={rewardBadge.rarity}>{rewardBadge.rarity}</BadgePill>
            </div>
          </div>
        </div>
      )}

      {/* need_more_info note */}
      {userStatus === 'need_more_info' && (
        <div className="mt-4 rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 text-sm text-ink">
          <p className="font-semibold text-gold-500">ต้องข้อมูลเพิ่มเติม</p>
          <p className="mt-1 text-muted">แอดมินขอข้อมูลเพิ่มเติม กรุณาส่งหลักฐานใหม่อีกครั้ง</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6">
        {canSubmit ? (
          <Button variant="gold" className="w-full" asChild>
            <Link href={`/app/submit/${mission.id}`}>ส่งหลักฐาน</Link>
          </Button>
        ) : userStatus === 'submitted' ? (
          <div className="rounded-xl bg-[#7B5BA6]/10 p-4 text-center text-sm text-[#7B5BA6]">
            อยู่ระหว่างตรวจสอบ — โปรดรอผลจากแอดมิน
          </div>
        ) : userStatus === 'completed' ? (
          <div className="rounded-xl bg-success/10 p-4 text-center text-sm text-success font-semibold">
            ✓ ภารกิจสำเร็จแล้ว
          </div>
        ) : (
          <div className="rounded-xl bg-sand-200 p-4 text-center text-sm text-muted">
            ภารกิจนี้ยังล็อกอยู่ — ทำภารกิจก่อนหน้าให้สำเร็จก่อน
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link href="/app/boards/ub-001" className="text-sm text-muted hover:text-ink">
          ← กลับไปบอร์ด
        </Link>
      </div>
    </div>
  );
}
