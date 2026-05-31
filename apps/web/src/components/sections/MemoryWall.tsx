import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import type { Memory } from '@/types/memory';

type MemoryWallProps = {
  memories: Memory[];
};

export function MemoryWall({ memories }: MemoryWallProps) {
  return (
    <section className="bg-sand-100 py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-forest-900 sm:text-3xl">
            ความทรงจำจาก Explorers
          </h2>
          <p className="mt-2 text-muted">เรื่องราวจากนักเดินทางที่ได้ใช้ชีวิตในอุทยาน</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <Card key={memory.id} hasHover className="overflow-hidden p-0">
              {memory.photoUrls[0] && (
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-800">
                  <Image
                    src={memory.photoUrls[0]}
                    alt={memory.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-forest-900 line-clamp-1">{memory.title}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{memory.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
