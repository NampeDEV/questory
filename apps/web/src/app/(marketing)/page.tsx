import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Copy, Award, ImageIcon } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { BadgePill } from '@/components/ui/BadgePill';
import { getBoards } from '@/lib/api/boards';
import { getPlans } from '@/lib/api/plans';
import { getPublicMemories } from '@/lib/api/memories';
import { getProducts } from '@/lib/api/products';
import { formatThb } from '@/lib/utils/format-thb';
import { siteConfig } from '@/config/site';
import { LandingAnalytics } from '@/app/(marketing)/_analytics/LandingAnalytics';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

// Mock ratings (Plan type has no rating field yet)
const mockRatings: Record<string, number> = {
  'plan-001': 4.9,
  'plan-002': 4.8,
  'plan-003': 4.9,
};

// Mock user info for memory wall
const mockMemoryUsers: Record<string, { name: string; likes: number }> = {
  'mem-001': { name: 'Dreamer',   likes: 124 },
  'mem-002': { name: 'Mintt',     likes: 98  },
  'mem-003': { name: 'Beammm',   likes: 78  },
  'mem-004': { name: 'Journeyyy', likes: 65  },
  'mem-005': { name: 'Wanderer',  likes: 52  },
  'mem-006': { name: 'ParkHiker', likes: 43  },
};

const communityFeatures = [
  { icon: Copy,      title: 'Copy Plan',      desc: 'คัดลอกแผนจากคนที่ไปมาแล้ว' },
  { icon: Users,     title: 'Community',      desc: 'ชุมชนนักเดินทางที่เข้าใจกัน' },
  { icon: Award,     title: 'Collect Badges', desc: 'สะสม Badge หลากหลายชนิด' },
  { icon: ImageIcon, title: 'Share Memory',   desc: 'แชร์ความทรงจำกับเพื่อน' },
];

// FE-PAGE-HOME (SPEC-08) — Server component
export default async function HomePage() {
  const [boards, plans, memories, products] = await Promise.all([
    getBoards(),
    getPlans(),
    getPublicMemories(),
    getProducts(),
  ]);

  // AC-LANDING-003: show 3 specific SKUs — Starter / Northern / Ultimate
  const FEATURED_SLUGS = ['starter-10-parks', 'northern-park-quest', 'ultimate-156-parks'] as const;
  const featuredBoards = FEATURED_SLUGS
    .map((slug) => boards.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => b !== undefined);
  const popularPlans   = plans.slice(0, 3);
  // AC-LANDING-005: show ≥6 memory tiles
  const memoryTiles    = memories.slice(0, 6);
  const shopProducts   = products.slice(0, 5);

  return (
    <>
      {/* AC-LANDING-009: fire landing_view on mount */}
      <LandingAnalytics />
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. How It Works */}
      <HowItWorks />

      {/* 3. Three-column: Boards | Plans | Memories */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1.1fr_1fr]">

            {/* ── Popular Boards ── */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">POPULAR BOARDS</p>
                <Link href="/boards" className="text-xs font-medium text-forest-700 hover:underline">ดูทั้งหมด &rsaquo;</Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {featuredBoards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/boards/${board.slug}`}
                    className="group relative overflow-hidden rounded-xl"
                    aria-label={`ดู ${board.name}`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-forest-800">
                      <Image
                        src={board.coverImageUrl}
                        alt={board.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 180px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/100 via-forest-950/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-bold leading-tight text-white line-clamp-2">{board.name}</p>
                        <p className="mt-0.5 text-[11px] text-sand-300/80">{board.questCount} Missions</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <BadgePill variant="default" className="text-[10px] py-0">{board.category}</BadgePill>
                          <span className="text-xs font-semibold text-gold-400">{formatThb(board.priceThb)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Popular Plans ── */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">POPULAR PLANS</p>
                <Link href="/plans" className="text-xs font-medium text-forest-700 hover:underline">ดูทั้งหมด &rsaquo;</Link>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {popularPlans.map((plan) => {
                  const rating = mockRatings[plan.id] ?? 4.7;
                  return (
                    <Link
                      key={plan.id}
                      href={`/plans/${plan.slug}`}
                      className="group flex gap-3 rounded-xl border border-forest-800/8 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-card"
                      aria-label={`ดูแผน ${plan.title}`}
                    >
                      <div className="relative h-16 w-[72px] flex-shrink-0 overflow-hidden rounded-lg bg-forest-800">
                        <Image src={plan.coverImageUrl} alt={plan.title} fill className="object-cover" sizes="72px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-forest-900 line-clamp-2 leading-tight">{plan.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted">
                          <span>{plan.durationDays}D</span>
                          <span>·</span>
                          <span>{formatThb(plan.budgetThb)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Users size={10} aria-hidden="true" />
                            {plan.copiedByCount.toLocaleString()} ครั้ง
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-0.5">
                          <Star size={11} className="fill-gold-400 text-gold-400" aria-hidden="true" />
                          <span className="text-[11px] font-medium text-forest-900">{rating}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href="/plans" className="mt-3 flex h-10 w-full items-center justify-center rounded-lg border border-forest-800/15 text-sm font-medium text-forest-700 transition-colors hover:bg-sand-50">
                ดูแผนทั้งหมด
              </Link>
            </div>

            {/* ── Memory Wall ── */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Memory Wall</h2>
                <Link href="/memories" className="text-xs font-medium text-forest-700 hover:underline">ดูทั้งหมด &rsaquo;</Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {memoryTiles.map((mem) => {
                  const user = mockMemoryUsers[mem.id] ?? { name: 'Explorer', likes: 0 };
                  const photo = mem.photoUrls[0];
                  return (
                    <Link
                      key={mem.id}
                      href="/memories"
                      className="group relative aspect-square overflow-hidden rounded-xl bg-forest-800"
                      aria-label={mem.title}
                    >
                      {photo && (
                        <Image src={photo} alt={mem.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="150px" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                        <div className="flex items-center gap-1">
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-forest-700 text-[8px] font-bold text-white">
                            {user.name.charAt(0)}
                          </div>
                          <p className="max-w-[60px] truncate text-[10px] font-medium text-white/90">{user.name}</p>
                        </div>
                        <p className="text-[10px] text-white/80">♥ {user.likes}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Shop Our Products */}
      <section className="bg-parchment py-10 lg:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">SHOP OUR PRODUCTS</p>
            <Link href="/shop" className="text-xs font-medium text-forest-700 hover:underline">ดูทั้งหมด &rsaquo;</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shopProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group overflow-hidden rounded-xl border border-forest-800/8 bg-white shadow-sm transition-shadow hover:shadow-card"
                aria-label={`ดู ${product.name}`}
              >
                <div className="relative aspect-square overflow-hidden bg-sand-100">
                  {product.imageUrls[0] && (
                    <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-forest-900 line-clamp-1">{product.name}</p>
                  <p className="mt-0.5 text-sm font-bold text-forest-700">{formatThb(product.priceThb)}</p>
                  <p className="mt-0.5 text-[11px] text-muted line-clamp-1">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Community features */}
      <section className="border-t border-forest-800/8 bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {communityFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-forest-700">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-semibold text-forest-900">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Join CTA */}
      <section className="bg-forest-900 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                พร้อมเริ่มการผจญภัยแล้วหรือยัง?
              </h2>
              <p className="mt-1 text-sm text-sand-300/80">
                สมัครฟรี! เริ่มบันทึกภารกิจและความทรงจำได้เลย
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link href="/activate" className="inline-flex h-11 items-center rounded-lg bg-gold-500 px-6 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400">
                สมัครสมาชิกฟรี
              </Link>
              <Link href="/auth/sign-in" className="inline-flex h-11 items-center rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
