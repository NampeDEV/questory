import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin } from 'lucide-react';
import { getPlanBySlug } from '@/lib/api/plans';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { formatThb } from '@/lib/utils/format-thb';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) return { title: 'Plan not found' };
  return { title: plan.title };
}

const difficultyVariants = {
  easy: 'success',
  moderate: 'warning',
  challenging: 'danger',
} as const;

// FE-PAGE-PLAN-DETAIL (SPEC-08)
export default async function PlanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) notFound();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero */}
      <div className="relative h-[320px] overflow-hidden bg-forest-900 lg:h-[420px]">
        <Image src={plan.coverImageUrl} alt={plan.title} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-wrap gap-2">
              <BadgePill variant={difficultyVariants[plan.difficulty]}>
                {plan.difficulty === 'easy' ? 'เริ่มต้น' : plan.difficulty === 'moderate' ? 'ปานกลาง' : 'ท้าทาย'}
              </BadgePill>
              <BadgePill variant="default">
                <MapPin size={12} className="mr-1" aria-hidden="true" />
                {plan.region}
              </BadgePill>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-white lg:text-4xl">
              {plan.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-sand-200/80">
              <span className="flex items-center gap-1">
                <Clock size={14} aria-hidden="true" /> {plan.durationDays} วัน
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} aria-hidden="true" /> คัดลอกแล้ว {plan.copiedByCount.toLocaleString()} ครั้ง
              </span>
              <span>งบประมาณ ≈ {formatThb(plan.budgetThb)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Itinerary */}
          <div className="lg:col-span-2">
            {/* Creator */}
            <div className="mb-8 flex items-center gap-3 rounded-xl border border-forest-800/10 bg-white/70 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 text-sm font-bold text-white">
                {plan.creatorName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-900">{plan.creatorName}</p>
                <p className="text-xs text-muted">Explorer</p>
              </div>
            </div>

            {/* Day-by-day */}
            <h2 className="font-serif text-xl font-bold text-forest-900">แผนการเดินทาง</h2>
            <div className="mt-4 space-y-6">
              {plan.days.map((day) => (
                <div key={day.day} className="relative pl-8">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest-800 text-xs font-bold text-white">
                    {day.day}
                  </div>
                  <div className="rounded-xl border border-forest-800/10 bg-white/70 p-4">
                    <h3 className="font-semibold text-forest-900"><span className="text-forest-500">Day {day.day} · </span>{day.title}</h3>
                    {day.parkName && (
                      <p className="mt-1 text-xs font-medium text-gold-500">
                        📍 {day.parkName}
                      </p>
                    )}
                    <ul className="mt-3 space-y-1">
                      {day.activities.map((activity) => (
                        <li key={activity} className="flex items-start gap-2 text-sm text-ink/80">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-forest-700" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                    {day.tips && (
                      <p className="mt-3 rounded-lg bg-gold-500/10 px-3 py-2 text-xs text-forest-800">
                        💡 {day.tips}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — Copy Plan CTA */}
          <div>
            <div className="sticky top-20 rounded-2xl border border-forest-800/10 bg-white/70 p-6 shadow-card">
              <h3 className="font-serif font-bold text-forest-900">คัดลอกแผนนี้</h3>
              <p className="mt-2 text-sm text-muted">
                คัดลอกแผนไปยังบัญชีของคุณเพื่อแก้ไขและใช้งาน
              </p>
              <Button variant="gold" className="mt-4 w-full" asChild>
                <Link href="/auth/sign-in">คัดลอกแผน (เข้าสู่ระบบก่อน)</Link>
              </Button>
              <div className="mt-6 space-y-2 border-t border-forest-800/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">ระยะเวลา</span>
                  <span className="font-medium">{plan.durationDays} วัน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">งบประมาณ</span>
                  <span className="font-medium">≈ {formatThb(plan.budgetThb)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">ภูมิภาค</span>
                  <span className="font-medium capitalize">{plan.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
