import type { Metadata } from 'next';
import { BoardFilterBar } from '@/components/sections/BoardFilterBar';
import { getBoards } from '@/lib/api/boards';

export const metadata: Metadata = {
  title: 'Boards',
  description: 'เลือกบอร์ดภารกิจอุทยานแห่งชาติที่เหมาะกับคุณ',
};

// FE-PAGE-BOARDS (SPEC-08)
export default async function BoardsPage() {
  const boards = await getBoards();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-forest-800/10 bg-forest-900 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950/70"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Boards</h1>
          <p className="mt-2 text-sand-200/70">เลือกบอร์ดและเริ่มต้น Quest ของคุณ</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        {/* Interactive filter bar + grid — TASK-013 */}
        <BoardFilterBar boards={boards} />

        {/* How boards work */}
        <div className="mt-16 rounded-2xl bg-forest-900/5 border border-forest-800/10 p-8">
          <h2 className="font-serif text-xl font-bold text-forest-900">
            บอร์ดทำงานอย่างไร?
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', text: 'ซื้อบอร์ดและรับ QR Activation Card' },
              { step: '2', text: 'สแกน QR เพื่อ Activate ภารกิจดิจิตอล' },
              { step: '3', text: 'ทำภารกิจครบ → รับ Badge และ Claim Pin' },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-forest-800 text-xs font-bold text-white">
                  {step}
                </span>
                <p className="text-sm text-ink">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
