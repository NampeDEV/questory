import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// JoinQuestCTA band (FE-PAGE-HOME, SPEC-08)
export function JoinQuestCTA() {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-16 lg:py-20">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/hero/hero-main.jpg')" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1280px] px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          พร้อมเริ่มการผจญภัยแล้วหรือยัง?
        </h2>
        <p className="mt-3 text-sand-200/80">
          เลือกบอร์ดของคุณ และเริ่มต้น Quest แรกได้เลยวันนี้
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="gold" size="lg" asChild>
            <Link href="/shop">ซื้อบอร์ดตอนนี้</Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
            asChild
          >
            <Link href="/boards">ดูบอร์ดทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
