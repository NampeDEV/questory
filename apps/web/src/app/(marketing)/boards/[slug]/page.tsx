import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBoardBySlug } from '@/lib/api/boards';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { formatThb } from '@/lib/utils/format-thb';
import { BoardDetailTabs } from '@/components/sections/BoardDetailTabs';
import { BoardAnalytics } from '@/app/(marketing)/boards/[slug]/_analytics/BoardAnalytics';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return { title: 'Board not found' };
  return { title: board.name, description: board.description };
}

// FE-PAGE-BOARD-DETAIL (SPEC-08)
export default async function BoardDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);

  if (!board) notFound();

  return (
    <div className="min-h-screen bg-parchment">
      {/* AC-LANDING-009: fire board_view on mount */}
      <BoardAnalytics boardId={board.id} boardName={board.name} />
      {/* Hero */}
      <div className="relative h-[360px] overflow-hidden bg-forest-900 lg:h-[480px]">
        <Image
          src={board.coverImageUrl}
          alt={board.name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="mx-auto max-w-[1280px]">
            <BadgePill variant="rare">{board.category}</BadgePill>
            <h1 className="mt-3 font-display text-3xl font-bold text-white lg:text-5xl">
              {board.name}
            </h1>
            <p className="mt-2 max-w-xl text-sand-200/80">{board.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-gold-400">
                {formatThb(board.priceThb)}
              </span>
              <Button variant="gold" size="lg" asChild>
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive tabs — FE-PAGE-BOARD-DETAIL (TASK-032) */}
      <BoardDetailTabs board={board} />
    </div>
  );
}
