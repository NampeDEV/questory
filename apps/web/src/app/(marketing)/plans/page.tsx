import type { Metadata } from 'next';
import { PlanFilterBar } from '@/components/sections/PlanFilterBar';
import { getPlans } from '@/lib/api/plans';

export const metadata: Metadata = {
  title: 'Plans',
  description: 'แผนการเดินทางที่ผ่านการพิสูจน์แล้ว คัดลอกและใช้งานได้เลย',
};

// FE-PAGE-PLANS (SPEC-08)
export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="relative overflow-hidden border-b border-forest-800/10 bg-forest-900 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950/70"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Travel Plans</h1>
          <p className="mt-2 text-sand-200/70">แผนการเดินทางที่ผ่านการพิสูจน์แล้วจาก Explorer จริง</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        {/* Interactive filter bar + grid — TASK-014 */}
        <PlanFilterBar plans={plans} />
      </div>
    </div>
  );
}
