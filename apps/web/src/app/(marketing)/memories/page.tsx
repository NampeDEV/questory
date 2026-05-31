import type { Metadata } from 'next';
import { getPublicMemories } from '@/lib/api/memories';
import { MemoryWall } from '@/components/sections/MemoryWall';

export const metadata: Metadata = {
  title: 'Memories',
  description: 'ความทรงจำจาก Explorer ที่ได้ใช้ชีวิตในอุทยานแห่งชาติไทย',
};

// FE-PAGE-MEMORY-WALL (SPEC-08)
export default async function MemoriesPage() {
  const memories = await getPublicMemories();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="relative overflow-hidden border-b border-forest-800/10 bg-forest-900 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950/70"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Memory Wall
          </h1>
          <p className="mt-2 text-sand-200/70">ความทรงจำจากอุทยานทั่วไทย</p>
        </div>
      </div>
      <MemoryWall memories={memories} />
    </div>
  );
}
