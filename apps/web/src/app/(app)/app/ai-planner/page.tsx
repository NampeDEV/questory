import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { AIPlannerPanel } from './AIPlannerPanel';

export const metadata: Metadata = {
  title: 'AI Planner',
  description: 'วางแผนการเดินทางด้วย AI',
};

// FE-PAGE-AI-PLANNER (SPEC-09) — TASK-015
// Feature-gated by NEXT_PUBLIC_AI_PLANNER_ENABLED
const aiEnabled = process.env.NEXT_PUBLIC_AI_PLANNER_ENABLED === 'true';

export default function AIPlannerPage() {
  if (!aiEnabled) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <Sparkles size={40} className="mx-auto text-gold-400" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold text-forest-900">AI Planner</h1>
          <p className="mt-2 text-sm text-muted">ฟีเจอร์นี้ยังไม่เปิดใช้งาน</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={24} className="text-gold-500" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold text-forest-900">AI Trip Planner</h1>
      </div>

      {/* Two-column layout: prompt input | AI output */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AIPlannerPanel />
      </div>
    </div>
  );
}
