import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBoards } from '@/lib/api/boards';
import { getMissions, getUserMissionStatuses } from '@/lib/api/missions';
import { missionStatusStyle } from '@/lib/utils/status-style';
import { Lock } from 'lucide-react';

type PageProps = {
  params: Promise<{ id: string }>;
};

// Mock user boards (same as boards/page.tsx)
const mockUserBoards = [
  { id: 'ub-001', boardTemplateId: 'bt-001', activatedAt: '2026-03-01T00:00:00Z', progressCompleted: 3, progressTotal: 10, status: 'active' as const },
  { id: 'ub-002', boardTemplateId: 'bt-002', activatedAt: '2026-04-15T00:00:00Z', progressCompleted: 0, progressTotal: 20, status: 'active' as const },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ub = mockUserBoards.find((b) => b.id === id);
  return { title: ub ? `บอร์ด #${id}` : 'Board not found' };
}

const categoryLabel: Record<string, string> = {
  mountain: '⛰️',
  waterfall: '💧',
  marine: '🌊',
  forest: '🌿',
};

// FE-PAGE-MY-BOARD-DETAIL (SPEC-08)
export default async function MyBoardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const userBoard = mockUserBoards.find((b) => b.id === id);
  if (!userBoard) notFound();

  const [templates, missions, statuses] = await Promise.all([
    getBoards(),
    getMissions(userBoard.boardTemplateId),
    getUserMissionStatuses(),
  ]);

  const template = templates.find((t) => t.id === userBoard.boardTemplateId);
  if (!template) notFound();

  const statusMap = Object.fromEntries(statuses.map((s) => [s.missionId, s.status]));

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Board hero */}
      <div className="relative h-44 overflow-hidden rounded-2xl bg-forest-800">
        <Image
          src={template.coverImageUrl}
          alt={template.name}
          fill
          className="object-cover opacity-70"
          sizes="(max-width: 640px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display text-xl font-bold text-white">{template.name}</h1>
          <ProgressBar
            value={userBoard.progressCompleted}
            max={userBoard.progressTotal}
            label={`${userBoard.progressCompleted} / ${userBoard.progressTotal} อุทยาน`}
            size="sm"
            isCompleted={userBoard.progressCompleted >= userBoard.progressTotal}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'ทั้งหมด', value: userBoard.progressTotal },
          { label: 'สำเร็จ',  value: userBoard.progressCompleted },
          { label: 'เหลือ',   value: userBoard.progressTotal - userBoard.progressCompleted },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-forest-800/10 bg-white/70 p-3 text-center">
            <p className="text-xl font-bold text-forest-900">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission grid */}
      <h2 className="mt-6 font-display text-lg font-bold text-forest-900">ภารกิจ</h2>
      <div className="mt-3 space-y-3">
        {missions.length > 0 ? (
          missions.map((mission) => {
            const status = statusMap[mission.id] ?? 'locked';
            const style = missionStatusStyle[status];
            const isLocked = status === 'locked';
            const isAvailable = status === 'available' || status === 'need_more_info';

            return (
              <Card
                key={mission.id}
                className={`flex items-center gap-3 p-3 ${isLocked ? 'opacity-60' : ''}`}
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-forest-800">
                  {isLocked ? (
                    <div className="flex h-full w-full items-center justify-center bg-forest-950/50">
                      <Lock size={16} className="text-sand-200" aria-hidden="true" />
                    </div>
                  ) : (
                    <Image
                      src={mission.coverImageUrl}
                      alt={mission.parkName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted">{categoryLabel[mission.category]} {mission.parkName}</p>
                  <p className="font-semibold text-forest-900 text-sm line-clamp-1">{mission.name}</p>
                </div>
                <div className="flex-shrink-0">
                  {isAvailable ? (
                    <Button variant="gold" size="sm" asChild>
                      <Link href={`/app/missions/${mission.id}`}>ทำภารกิจ</Link>
                    </Button>
                  ) : (
                    <span className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold ${style.className}`}>
                      {style.label}
                    </span>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          // Placeholder list when no specific missions available for this board
          Array.from({ length: userBoard.progressTotal }).map((_, i) => (
            <Card key={i} className="flex items-center gap-3 p-3 opacity-50">
              <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-sand-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-sand-200" />
                <div className="h-3 w-1/2 rounded bg-sand-200" />
              </div>
              <Lock size={16} className="text-muted flex-shrink-0" />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
