import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'Creator / Partner — Questory Admin' };

const MOCK_CREATORS = [
  { id: 'CRT-001', name: 'TrailBlazer TH', handle: '@trailblazer.th', type: 'creator', followers: 28400, plansPublished: 12, status: 'active' },
  { id: 'CRT-002', name: 'Thai National Parks Official', handle: '@tnp.official', type: 'partner', followers: 150000, plansPublished: 5, status: 'active' },
  { id: 'CRT-003', name: 'Mountain Seekers', handle: '@mountain.seekers', type: 'creator', followers: 9800, plansPublished: 7, status: 'active' },
  { id: 'CRT-004', name: 'Marine Explorers', handle: '@marine.exp', type: 'partner', followers: 45000, plansPublished: 3, status: 'inactive' },
] as const;

export default function CreatorsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Creator / Partner"
        description="จัดการบัญชี Creator และ Partner ที่ร่วมงาน"
        action={{ label: '+ เชิญ Creator', href: '/admin/creators/invite' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">ชื่อ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ประเภท</th>
              <th className="hidden px-4 py-3 text-right text-xs font-semibold text-muted md:table-cell">Followers</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted lg:table-cell">แผนที่เผยแพร่</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_CREATORS.map((c) => (
              <tr key={c.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-muted">{c.handle}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${c.type === 'partner' ? 'bg-gold-500/15 text-gold-700' : 'bg-forest-800/8 text-forest-800'}`}>
                    {c.type === 'partner' ? 'Partner' : 'Creator'}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 text-right font-bold text-ink md:table-cell">
                  {c.followers.toLocaleString()}
                </td>
                <td className="hidden px-4 py-3.5 text-center text-ink lg:table-cell">{c.plansPublished}</td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">จัดการ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
