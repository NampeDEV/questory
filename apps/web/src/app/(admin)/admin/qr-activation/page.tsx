import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';


export const metadata: Metadata = { title: 'QR Activation — Questory Admin' };

// ADMIN-046 (TASK_ADMIN)

const MOCK_QR_CODES = [
  { id: 'QR-2024-001', boardName: 'บอร์ดดอยอินทนนท์', batchId: 'BATCH-DNI-001', generated: 100, activated: 68, remaining: 32, createdAt: '01 เม.ย. 2567' },
  { id: 'QR-2024-002', boardName: 'บอร์ดเขาใหญ่ Explorer', batchId: 'BATCH-KYI-001', generated: 80, activated: 42, remaining: 38, createdAt: '15 เม.ย. 2567' },
  { id: 'QR-2024-003', boardName: 'บอร์ดสิมิลัน Diver', batchId: 'BATCH-SML-001', generated: 60, activated: 31, remaining: 29, createdAt: '01 พ.ค. 2567' },
] as const;

export default function QrActivationPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="QR Activation"
        description="จัดการและสร้าง QR Code สำหรับ activate บอร์ด"
        action={{ label: '+ สร้าง Batch QR', href: '/admin/qr-activation/new' }}
      />

      <div className="mt-5 grid gap-4">
        {MOCK_QR_CODES.map((batch) => {
          const activationRate = Math.round((batch.activated / batch.generated) * 100);
          return (
            <div
              key={batch.id}
              className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{batch.boardName}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{batch.batchId}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-lg border border-forest-800/20 px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-sand-100">
                    ดาวน์โหลด QR
                  </button>
                  <button type="button" className="rounded-lg bg-forest-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-forest-700">
                    พิมพ์ทั้งชุด
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center rounded-xl bg-sand-100/60 py-3">
                  <p className="text-xl font-bold text-ink">{batch.generated}</p>
                  <p className="text-xs text-muted">QR ทั้งหมด</p>
                </div>
                <div className="text-center rounded-xl bg-success/8 py-3">
                  <p className="text-xl font-bold text-success">{batch.activated}</p>
                  <p className="text-xs text-muted">Activated</p>
                </div>
                <div className="text-center rounded-xl bg-gold-500/10 py-3">
                  <p className="text-xl font-bold text-gold-700">{batch.remaining}</p>
                  <p className="text-xs text-muted">คงเหลือ</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>อัตราการ Activate</span>
                  <span className="font-semibold text-ink">{activationRate}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand-200">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{ width: `${activationRate}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">สร้างเมื่อ: {batch.createdAt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
