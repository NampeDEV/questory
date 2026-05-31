import Link from 'next/link';
import Image from 'next/image';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Compass, BookOpen, Award, Camera, MapPin, Sparkles } from 'lucide-react';
import { getMissions } from '@/lib/api/missions';
import { getPublicMemories } from '@/lib/api/memories';

export const dynamic = 'force-dynamic';

// FE-PAGE-DASHBOARD (SPEC-08) — mock data, no auth yet
const mockUser = { displayName: 'Chayachai' };
const mockBoard = { name: 'Northern Park Quest', progressCompleted: 3, progressTotal: 20 };

const quickActions = [
  { label: 'เริ่มภารกิจ', href: '/app/missions', icon: Compass },
  { label: 'ภารกิจถัดไป', href: '/app/missions', icon: BookOpen },
  { label: 'Claim Pin', href: '/app/pins', icon: Award },
  { label: 'บันทึกความทรงจำ', href: '/app/memories', icon: Camera },
];

const AI_PLANNER_ENABLED = process.env.NEXT_PUBLIC_AI_PLANNER_ENABLED === 'true';

export default async function DashboardPage() {
  const greeting = 'สวัสดี';

  const [missions, memories] = await Promise.all([
    getMissions(),
    getPublicMemories(),
  ]);

  const nextMission = missions.find((m) => m.status === 'active') ?? missions[0] ?? null;
  const recentMemories = memories.slice(0, 3);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-muted">{greeting}</p>
        <h1 className="font-display text-2xl font-bold text-forest-900">
          {mockUser.displayName} 👋
        </h1>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl border border-forest-800/10 bg-forest-900 p-5 text-white shadow-card">
        <p className="text-sm text-sand-200/70">{mockBoard.name}</p>
        <p className="mt-1 text-xl font-bold">
          {mockBoard.progressCompleted} / {mockBoard.progressTotal} Parks
        </p>
        <div className="mt-3">
          <ProgressBar
            value={mockBoard.progressCompleted}
            max={mockBoard.progressTotal}
            label={`${mockBoard.progressCompleted} / ${mockBoard.progressTotal} อุทยาน`}
            size="lg"
          />
        </div>
        <p className="mt-2 text-xs text-sand-200/50">
          เหลืออีก {mockBoard.progressTotal - mockBoard.progressCompleted} ภารกิจ
        </p>
      </div>

      {/* Next mission card (TASK-033) */}
      {nextMission !== null && (
        <div className="mt-6 rounded-2xl border border-forest-800/10 bg-white/80 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">
              ภารกิจถัดไป
            </p>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
              พร้อมทำ
            </span>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-forest-800/10">
              <MapPin size={18} className="text-forest-700" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-forest-900 leading-snug">{nextMission.name}</p>
              <p className="mt-0.5 text-sm text-muted">{nextMission.parkName}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-4 w-full" asChild>
            <Link href={`/app/missions/${nextMission.id}`}>ดูรายละเอียดภารกิจ</Link>
          </Button>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href + label}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-forest-800/10 bg-white/70 p-4 text-sm font-medium text-forest-900 transition-colors hover:bg-sand-100"
          >
            <Icon size={18} className="text-forest-700" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>

      {/* AI Planner entry (TASK-033) — flag-gated */}
      {AI_PLANNER_ENABLED && (
        <div className="mt-6 rounded-2xl border border-gold-400/40 bg-gradient-to-br from-gold-500/10 to-forest-800/5 p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-gold-600" aria-hidden="true" />
            <p className="font-semibold text-forest-900">AI Trip Planner</p>
          </div>
          <p className="mt-1 text-sm text-muted">
            วางแผนการเดินทางอัตโนมัติ ครอบคลุมทุกภารกิจ ด้วย AI
          </p>
          <Button variant="gold" size="sm" className="mt-3" asChild>
            <Link href="/app/ai-planner">เริ่มวางแผน</Link>
          </Button>
        </div>
      )}

      {/* Recent memories carousel (TASK-033) */}
      {recentMemories.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-forest-900">ความทรงจำล่าสุด</h2>
            <Link href="/app/memories" className="text-xs text-forest-600 hover:text-forest-900">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {recentMemories.map((memory) => {
              const photo = memory.photoUrls[0];
              return (
                <div
                  key={memory.id}
                  className="w-44 flex-shrink-0 overflow-hidden rounded-xl border border-forest-800/10 bg-white/80 shadow-card"
                >
                  {photo !== undefined ? (
                    <div className="relative h-28 w-full">
                      <Image
                        src={photo}
                        alt={memory.title}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-sand-100">
                      <Camera size={24} className="text-muted" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="line-clamp-2 text-xs font-medium text-forest-900 leading-snug">
                      {memory.title}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      {new Date(memory.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Cross-sell */}
      <div className="mt-6 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-5">
        <p className="text-sm font-semibold text-forest-900">
          อยากสำรวจภูมิภาคใหม่?
        </p>
        <p className="mt-1 text-sm text-muted">ดู Southern Marine Quest ที่มี 18 ภารกิจใต้ทะเล</p>
        <Button variant="gold" size="sm" className="mt-3" asChild>
          <Link href="/boards/southern-marine-quest">ดูบอร์ด</Link>
        </Button>
      </div>
    </div>
  );
}

