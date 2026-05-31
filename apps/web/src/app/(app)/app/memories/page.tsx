import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicMemories } from '@/lib/api/memories';
import { Card } from '@/components/ui/Card';
import { Calendar, Grid3X3, List } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Memories',
  description: 'ความทรงจำการเดินทางของคุณ',
};

// FE-PAGE-MY-MEMORIES (SPEC-08) — mock uses public memories as user's own
export default async function MyMemoriesPage() {
  const memories = await getPublicMemories();

  // Mock: treat first 4 as user's own memories
  const userMemories = memories.slice(0, 4);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">ความทรงจำ</h1>
          <p className="mt-1 text-sm text-muted">{userMemories.length} ความทรงจำ</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="mb-5 flex rounded-xl border border-forest-800/10 bg-sand-100 p-1" role="tablist">
        <button
          role="tab"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-forest-900 shadow-card"
        >
          <List size={16} aria-hidden="true" />
          Timeline
        </button>
        <button
          role="tab"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted hover:text-forest-900"
        >
          <Grid3X3 size={16} aria-hidden="true" />
          Grid
        </button>
      </div>

      {/* Timeline view */}
      {userMemories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest-700/30 p-10 text-center">
          <p className="text-muted text-sm">ยังไม่มีความทรงจำ</p>
          <Link
            href="/app/boards"
            className="mt-4 inline-flex h-[44px] items-center rounded-lg bg-forest-800 px-6 text-sm font-semibold text-white hover:bg-forest-700"
          >
            เริ่มภารกิจแรก
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userMemories.map((memory) => (
            <Card key={memory.id} hasHover className="overflow-hidden">
              <div className="flex gap-4 p-4">
                {memory.photoUrls[0] && (
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-forest-800">
                    <Image
                      src={memory.photoUrls[0]}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-forest-900 line-clamp-1">{memory.title}</h2>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{memory.body}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                    <Calendar size={12} aria-hidden="true" />
                    {new Date(memory.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold ${
                      memory.visibility === 'public'
                        ? 'bg-success/10 text-success'
                        : 'bg-sand-200 text-muted'
                    }`}>
                      {memory.visibility === 'public' ? 'สาธารณะ' : 'ส่วนตัว'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
