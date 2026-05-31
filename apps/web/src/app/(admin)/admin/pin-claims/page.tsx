import type { Metadata } from 'next';
import { PinClaimsTable } from './PinClaimsTable';

export const metadata: Metadata = { title: 'Pin Claims — Questory Admin' };

// ADMIN-051 (TASK_ADMIN) — Pin Claims: Mark Shipped + tracking number form
const MOCK_PIN_CLAIMS = [
  { id: 'claim-001', user: 'ณัฐวุฒิ แสงทอง',  pin: 'Doi Inthanon Badge Pin', status: 'claimed',  address: '123 ถนนนิมมาน เชียงใหม่ 50200',  trackingNumber: null },
  { id: 'claim-002', user: 'ศิริพร อันทรดี',    pin: 'Khao Yai Explorer Pin',  status: 'claimed',  address: '456 ถนนสุขุมวิท กรุงเทพ 10110',    trackingNumber: null },
  { id: 'claim-003', user: 'Akira Tanaka',     pin: 'Similan Reef Pin',       status: 'shipped',  address: '789 ถนนราชดำเนิน ภูเก็ต 83000',    trackingNumber: 'TH123456789TH' },
  { id: 'claim-004', user: 'พรทิพย์ รักไทย',   pin: 'Erawan Waterfall Pin',   status: 'delivered', address: '321 ถนนเพชรบุรี กรุงเทพ 10400',   trackingNumber: 'TH987654321TH' },
] as const;

export type MockPinClaim = (typeof MOCK_PIN_CLAIMS)[number];

export default function PinClaimsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-forest-900">Pin Claims</h1>
        <p className="mt-1 text-sm text-muted">จัดการคำขอ Pin และอัปเดตเลข Tracking สำหรับการจัดส่ง</p>
      </div>
      <PinClaimsTable claims={[...MOCK_PIN_CLAIMS]} />
    </div>
  );
}
