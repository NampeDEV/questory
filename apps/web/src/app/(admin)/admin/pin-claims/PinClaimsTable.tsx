'use client';

import { useState } from 'react';
import { Package, Truck, X, Check } from 'lucide-react';
import type { MockPinClaim } from './page';

// ADMIN-051 — Pin Claims table: Mark Shipped + tracking number form
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  claim_available: { label: 'รอ Claim',    className: 'bg-gold-100 text-gold-800' },
  claimed:         { label: 'รอจัดส่ง',   className: 'bg-forest-100 text-forest-800' },
  shipped:         { label: 'จัดส่งแล้ว', className: 'bg-success/10 text-success' },
  delivered:       { label: 'ได้รับแล้ว',  className: 'bg-success/20 text-success' },
};

type ClaimState = {
  status: string;
  trackingNumber: string | null;
};

type PinClaimsTableProps = {
  claims: MockPinClaim[];
};

export function PinClaimsTable({ claims }: PinClaimsTableProps) {
  const [states, setStates] = useState<Record<string, ClaimState>>(
    () => Object.fromEntries(
      claims.map((c) => [c.id, { status: c.status, trackingNumber: c.trackingNumber }]),
    ),
  );
  // Track which row is showing the tracking form
  const [activeShipId, setActiveShipId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  function openShipForm(claimId: string) {
    setActiveShipId(claimId);
    setTrackingInput('');
  }

  function confirmShipped(claimId: string) {
    if (!trackingInput.trim()) return;
    setStates((prev) => ({
      ...prev,
      [claimId]: { status: 'shipped', trackingNumber: trackingInput.trim() },
    }));
    setActiveShipId(null);
    setTrackingInput('');
  }

  function cancelShipForm() {
    setActiveShipId(null);
    setTrackingInput('');
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-forest-800/10 bg-sand-100/60 text-left">
            <th className="px-4 py-3 font-semibold text-forest-900">ผู้ใช้</th>
            <th className="px-4 py-3 font-semibold text-forest-900">Pin</th>
            <th className="hidden px-4 py-3 font-semibold text-forest-900 sm:table-cell">ที่อยู่จัดส่ง</th>
            <th className="hidden px-4 py-3 font-semibold text-forest-900 md:table-cell">Tracking</th>
            <th className="px-4 py-3 font-semibold text-forest-900">สถานะ</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-800/6">
          {claims.map((claim) => {
            const state  = states[claim.id] ?? { status: claim.status, trackingNumber: claim.trackingNumber };
            const badge  = STATUS_LABEL[state.status] ?? STATUS_LABEL['claimed']!;
            const isShip = activeShipId === claim.id;
            return (
              <tr key={claim.id} className="hover:bg-sand-100/30">
                <td className="px-4 py-3 text-ink">{claim.user}</td>
                <td className="px-4 py-3 font-medium text-ink">{claim.pin}</td>
                <td className="hidden px-4 py-3 text-xs text-muted sm:table-cell">{claim.address}</td>
                <td className="hidden px-4 py-3 text-xs text-muted md:table-cell">
                  {state.trackingNumber ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {state.status === 'claimed' && !isShip && (
                    <button
                      type="button"
                      onClick={() => openShipForm(claim.id)}
                      className="flex items-center gap-1 text-xs font-medium text-forest-700 hover:underline"
                    >
                      <Package size={12} aria-hidden="true" />
                      ใส่ Tracking
                    </button>
                  )}
                  {isShip && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="เลข Tracking"
                        className="w-32 rounded-lg border border-forest-800/20 px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest-700"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => confirmShipped(claim.id)}
                        disabled={!trackingInput.trim()}
                        aria-label="ยืนยัน"
                        className="rounded-lg bg-success/10 p-1 text-success hover:bg-success/20 disabled:opacity-40"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelShipForm}
                        aria-label="ยกเลิก"
                        className="rounded-lg bg-sand-100 p-1 text-muted hover:bg-sand-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {state.status === 'shipped' && (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <Truck size={12} aria-hidden="true" />
                      จัดส่งแล้ว
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
