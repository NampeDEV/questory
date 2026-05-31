import { describe, expect, it } from 'vitest';
import { missionStatusStyle, orderStatusStyle, pinStatusStyle } from '../../src/lib/utils/status-style';

describe('status-style maps', () => {
  it('contains required mission statuses', () => {
    expect(missionStatusStyle.available.label).toBe('พร้อมทำ');
    expect(missionStatusStyle.rejected.className).toContain('text-danger');
  });

  it('contains required order statuses', () => {
    expect(orderStatusStyle.paid.label).toBe('ชำระแล้ว');
    expect(orderStatusStyle.cancelled.className).toContain('text-danger');
  });

  it('contains required pin statuses', () => {
    expect(pinStatusStyle.claim_available.label).toBe('Claim ได้');
    expect(pinStatusStyle.delivered.className).toContain('text-white');
  });
});
