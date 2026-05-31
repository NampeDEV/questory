import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BadgePill } from '@/components/ui/BadgePill';
import { Card } from '@/components/ui/Card';
import { getBoards } from '@/lib/api/boards';

export const metadata: Metadata = {
  title: 'My Boards',
  description: 'บอร์ดภารกิจของคุณ',
};

// Mock user boards data (RULE-005)
const mockUserBoards = [
  { id: 'ub-001', boardTemplateId: 'bt-001', activatedAt: '2026-03-01T00:00:00Z', progressCompleted: 3, progressTotal: 10, status: 'active' as const },
  { id: 'ub-002', boardTemplateId: 'bt-002', activatedAt: '2026-04-15T00:00:00Z', progressCompleted: 0, progressTotal: 20, status: 'active' as const },
];

// FE-PAGE-MY-BOARDS (SPEC-08)
export default async function MyBoardsPage() {
  const allTemplates = await getBoards();
  const templateMap = Object.fromEntries(allTemplates.map((t) => [t.id, t]));

  const boards = mockUserBoards.map((ub) => ({
    userBoard: ub,
    template: templateMap[ub.boardTemplateId],
  })).filter((b): b is { userBoard: typeof b.userBoard; template: NonNullable<typeof b.template> } => !!b.template);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-forest-900">บอร์ดของฉัน</h1>
        <p className="mt-1 text-sm text-muted">บอร์ดที่ Activate แล้วทั้งหมด</p>
      </div>

      {boards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest-700/30 p-10 text-center">
          <p className="text-muted">ยังไม่มีบอร์ด</p>
          <Link
            href="/activate"
            className="mt-4 inline-flex h-[44px] items-center rounded-lg bg-forest-800 px-6 text-sm font-semibold text-white hover:bg-forest-700"
          >
            Activate บอร์ด
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {boards.map(({ userBoard, template }) => {
            const pct = Math.round((userBoard.progressCompleted / userBoard.progressTotal) * 100);
            const isCompleted = userBoard.progressCompleted >= userBoard.progressTotal;
            return (
              <Link
                key={userBoard.id}
                href={`/app/boards/${userBoard.id}`}
                aria-label={`ดูบอร์ด ${template.name}`}
              >
                <Card hasHover className="overflow-hidden">
                  <div className="relative h-36 overflow-hidden bg-forest-800">
                    <Image
                      src={template.coverImageUrl}
                      alt={template.name}
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 640px) 100vw, 512px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <BadgePill variant={isCompleted ? 'success' : 'default'}>
                            {isCompleted ? 'สำเร็จ' : 'กำลังดำเนินการ'}
                          </BadgePill>
                          <h2 className="mt-1 font-serif font-bold text-white line-clamp-1">
                            {template.name}
                          </h2>
                        </div>
                        <span className="text-xl font-bold text-gold-400">{pct}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <ProgressBar
                      value={userBoard.progressCompleted}
                      max={userBoard.progressTotal}
                      label={`${userBoard.progressCompleted} / ${userBoard.progressTotal} อุทยาน`}
                      size="sm"
                      isCompleted={isCompleted}
                    />
                    <p className="mt-2 text-xs text-muted">
                      Activate: {new Date(userBoard.activatedAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/activate"
          className="inline-flex h-[44px] items-center rounded-lg border border-forest-700/30 px-6 text-sm font-semibold text-forest-800 hover:bg-sand-100"
        >
          + Activate บอร์ดเพิ่ม
        </Link>
      </div>
    </div>
  );
}
