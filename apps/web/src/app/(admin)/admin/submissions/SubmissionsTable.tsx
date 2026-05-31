'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ZoomIn, X } from 'lucide-react';
import Image from 'next/image';
import type { MockSubmission } from './page';

// ADMIN-050 — Submissions table: photo viewer + approve/reject drawer
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  submitted:     { label: 'รอตรวจสอบ',    className: 'bg-gold-100 text-gold-800' },
  approved:      { label: 'อนุมัติแล้ว',   className: 'bg-success/10 text-success' },
  rejected:      { label: 'ปฏิเสธ',        className: 'bg-danger/10 text-danger' },
  need_more_info:{ label: 'ขอข้อมูลเพิ่ม', className: 'bg-sand-200 text-ink' },
};

type SubmissionsTableProps = {
  submissions: MockSubmission[];
};

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(submissions.map((s) => [s.id, s.status])),
  );
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected,    setSelected]    = useState<MockSubmission | null>(null);

  function openDrawer(sub: MockSubmission) {
    setSelected(sub);
    setDrawerOpen(true);
  }

  function approve() {
    if (!selected) return;
    setStatuses((prev) => ({ ...prev, [selected.id]: 'approved' }));
    setDrawerOpen(false);
  }

  function reject() {
    if (!selected) return;
    setStatuses((prev) => ({ ...prev, [selected.id]: 'rejected' }));
    setDrawerOpen(false);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/10 bg-sand-100/60 text-left">
              <th className="px-4 py-3 font-semibold text-forest-900">รูป</th>
              <th className="px-4 py-3 font-semibold text-forest-900">ผู้ใช้</th>
              <th className="hidden px-4 py-3 font-semibold text-forest-900 md:table-cell">ภารกิจ</th>
              <th className="hidden px-4 py-3 font-semibold text-forest-900 lg:table-cell">อุทยาน</th>
              <th className="px-4 py-3 font-semibold text-forest-900">วันที่</th>
              <th className="px-4 py-3 font-semibold text-forest-900">สถานะ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {submissions.map((sub) => {
              const currentStatus = statuses[sub.id] ?? sub.status;
              const badge = STATUS_LABEL[currentStatus] ?? STATUS_LABEL['submitted']!;
              return (
                <tr key={sub.id} className="hover:bg-sand-100/30">
                  <td className="px-4 py-3">
                    {sub.photoUrl && (
                      <Image src={sub.photoUrl} alt="proof" width={40} height={40} className="h-10 w-10 rounded object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{sub.user}</div>
                    <div className="text-xs text-muted">{sub.userHandle}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink md:table-cell">{sub.mission}</td>
                  <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">{sub.park}</td>
                  <td className="px-4 py-3 text-xs text-muted">{sub.date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(currentStatus === 'submitted') && (
                      <button
                        type="button"
                        onClick={() => openDrawer(sub)}
                        className="text-xs font-medium text-forest-700 hover:underline"
                      >
                        ตรวจสอบ
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action drawer — photo viewer + approve/reject */}
      {drawerOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="ตรวจสอบหลักฐาน"
        >
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-2xl">
            {/* Drawer header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-forest-900">
                  ตรวจสอบหลักฐาน
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {selected.user} · {selected.mission}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="ปิด"
                className="rounded-lg p-1 text-muted hover:bg-sand-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo preview */}
            <div className="relative mt-4 overflow-hidden rounded-xl bg-sand-100">
              <Image
                src={selected.photoUrl}
                alt={`หลักฐาน ${selected.mission}`}
                width={560}
                height={315}
                className="h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="ขยายรูป"
                className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black/80"
              >
                <ZoomIn size={12} />
                ขยาย
              </button>
            </div>

            {/* Note */}
            {selected.note && (
              <p className="mt-3 rounded-xl bg-sand-50 px-4 py-3 text-sm text-ink">
                {selected.note}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={approve}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-sm font-semibold text-success hover:bg-success/20"
              >
                <CheckCircle size={16} /> อนุมัติ
              </button>
              <button
                type="button"
                onClick={reject}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger/10 py-3 text-sm font-semibold text-danger hover:bg-danger/20"
              >
                <XCircle size={16} /> ปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="รูปขนาดใหญ่"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="ปิด Lightbox"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <Image
            src={selected.photoUrl}
            alt={`หลักฐาน ${selected.mission}`}
            width={1200}
            height={675}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
