import Link from 'next/link';
import { ShoppingBag, QrCode, Compass, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// HowItWorks — 4 steps per AC-LANDING-004 (SPEC-08)

const steps = [
  {
    icon: ShoppingBag,
    num: '1',
    title: 'Buy',
    desc: 'เลือกบอร์ดที่ใช่ ตั้งแต่ Starter จนถึง Ultimate',
  },
  {
    icon: QrCode,
    num: '2',
    title: 'Activate',
    desc: 'สแกน QR เชื่อมต่อบอร์ดจริงกับแอป เปิดใช้งาน Quest',
  },
  {
    icon: Compass,
    num: '3',
    title: 'Travel',
    desc: 'ออกไปทำภารกิจ เก็บประสบการณ์ทั่วอุทยาน',
  },
  {
    icon: Award,
    num: '4',
    title: 'Collect',
    desc: 'ปลดล็อก Badge และ Claim Pin เป็นของรางวัล',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-parchment py-14 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* ── Left: label + title + 4 steps ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">
              HOW IT WORKS
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-forest-900 sm:text-3xl">
              เริ่มต้นง่าย แค่ 4 ขั้นตอน
            </h2>

            {/* Steps row */}
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex items-start sm:flex-1 sm:flex-col sm:items-center">
                    {/* Icon circle + connector arrow */}
                    <div className="flex items-center sm:flex-col sm:items-center sm:w-full">
                      <div className="relative flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 shadow-card">
                          <Icon size={22} className="text-white" aria-hidden="true" />
                        </div>
                        {/* Step number badge */}
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-forest-950">
                          {step.num}
                        </span>
                      </div>
                      {/* Connector — dashed line (only between steps) */}
                      {idx < steps.length - 1 && (
                        <div className="mx-3 hidden h-px flex-1 border-t-2 border-dashed border-forest-300 sm:block" />
                      )}
                    </div>
                    {/* Text */}
                    <div className="ml-4 sm:ml-0 sm:mt-4 sm:px-1 sm:text-center">
                      <p className="text-sm font-semibold text-forest-900">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: AI Planner card ── */}
          <div className="flex items-start justify-center lg:items-center lg:justify-end">
            <div className="w-full max-w-[280px] overflow-hidden rounded-2xl bg-forest-900 p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  AI PLANNER
                </p>
                <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                  New
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/90">
                ให้ AI ช่วยวางแผนการเดินทาง หรือการจัดตัดไปของคุณ
              </p>
              <div className="mt-5 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Sparkles size={36} className="text-gold-400" aria-hidden="true" />
                </div>
              </div>
              <Button variant="gold" className="mt-5 w-full" asChild>
                <Link href="/plans">วางแผนกับ AI</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
