import type { Badge, Pin, PinClaim, PinStatus } from '@/types/pin';

// Mock badges (RULE-005, SPEC-06)
export const badges: Badge[] = [
  { id: 'badge-001', name: 'ผู้พิชิตดอยอินทนนท์', description: 'พิชิตยอดดอยสูงสุดในไทย', imageUrl: '/images/pins/mountain-badge.png', rarity: 'rare', missionId: 'msn-001', boardTemplateId: null },
  { id: 'badge-002', name: 'ผู้พิทักษ์เขาใหญ่', description: 'สำรวจมรดกโลกเขาใหญ่', imageUrl: '/images/pins/forest-badge.png', rarity: 'common', missionId: 'msn-002', boardTemplateId: null },
  { id: 'badge-003', name: 'นักปีนเอราวัณ', description: 'พิชิตน้ำตก 7 ชั้น', imageUrl: '/images/pins/waterfall-badge.png', rarity: 'uncommon', missionId: 'msn-003', boardTemplateId: null },
  { id: 'badge-004', name: 'นักดำน้ำสิมิลัน', description: 'สัมผัสใต้ทะเลสวรรค์', imageUrl: '/images/pins/marine-badge.png', rarity: 'epic', missionId: 'msn-004', boardTemplateId: null },
  { id: 'badge-005', name: 'ผู้พิชิตภูกระดึง', description: 'ยอดผา 1325 เมตร', imageUrl: '/images/pins/mountain-badge.png', rarity: 'rare', missionId: 'msn-005', boardTemplateId: null },
  { id: 'badge-006', name: 'ผู้แสวงบุญดอยสุเทพ', description: 'ขึ้นวัดบนยอดดอย', imageUrl: '/images/pins/mountain-badge.png', rarity: 'common', missionId: 'msn-006', boardTemplateId: null },
  { id: 'badge-007', name: 'นักล่องแก่งแม่ปิง', description: 'พิชิตแก่งมรดกโลก', imageUrl: '/images/pins/waterfall-badge.png', rarity: 'uncommon', missionId: 'msn-007', boardTemplateId: null },
  { id: 'badge-008', name: 'ผู้พิทักษ์ตะรุเตา', description: 'เยือนเกาะในประวัติศาสตร์', imageUrl: '/images/pins/marine-badge.png', rarity: 'rare', missionId: 'msn-008', boardTemplateId: null },
  { id: 'badge-009', name: 'นักล่องน้ำตกไทรโยค', description: 'ชมสายน้ำในหุบเขา', imageUrl: '/images/pins/waterfall-badge.png', rarity: 'common', missionId: 'msn-009', boardTemplateId: null },
  { id: 'badge-010', name: 'นักท่องพีพี', description: 'ประตูสู่เกาะ', imageUrl: '/images/pins/marine-badge.png', rarity: 'uncommon', missionId: 'msn-010', boardTemplateId: null },
  { id: 'badge-comp-001', name: 'Starter Quest Complete', description: 'ทำภารกิจ Starter Pack ครบทุกข้อ', imageUrl: '/images/pins/completion-badge.png', rarity: 'legendary', missionId: null, boardTemplateId: 'bt-001' },
];

// Mock pins (physical collectible pins)
export const pins: Pin[] = [
  { id: 'pin-001', badgeId: 'badge-001', name: 'Pin ดอยอินทนนท์', imageUrl: '/images/pins/mountain-badge.png', type: 'mission' },
  { id: 'pin-002', badgeId: 'badge-002', name: 'Pin เขาใหญ่', imageUrl: '/images/pins/forest-badge.png', type: 'mission' },
  { id: 'pin-003', badgeId: 'badge-003', name: 'Pin เอราวัณ', imageUrl: '/images/pins/waterfall-badge.png', type: 'mission' },
  { id: 'pin-004', badgeId: 'badge-004', name: 'Pin สิมิลัน', imageUrl: '/images/pins/marine-badge.png', type: 'mission' },
  { id: 'pin-005', badgeId: 'badge-005', name: 'Pin ภูกระดึง', imageUrl: '/images/pins/mountain-badge.png', type: 'mission' },
  { id: 'pin-006', badgeId: 'badge-006', name: 'Pin ดอยสุเทพ', imageUrl: '/images/pins/mountain-badge.png', type: 'mission' },
  { id: 'pin-007', badgeId: 'badge-007', name: 'Pin แม่ปิง', imageUrl: '/images/pins/waterfall-badge.png', type: 'mission' },
  { id: 'pin-008', badgeId: 'badge-008', name: 'Pin ตะรุเตา', imageUrl: '/images/pins/marine-badge.png', type: 'mission' },
  { id: 'pin-009', badgeId: 'badge-009', name: 'Pin ไทรโยค', imageUrl: '/images/pins/waterfall-badge.png', type: 'mission' },
  { id: 'pin-010', badgeId: 'badge-010', name: 'Pin พีพี', imageUrl: '/images/pins/marine-badge.png', type: 'mission' },
  { id: 'pin-comp-001', badgeId: 'badge-comp-001', name: 'Completion Pin — Starter', imageUrl: '/images/pins/completion-badge.png', type: 'completion' },
];

// Mock user pin states
export type PinWithStatus = Pin & {
  rarity: Badge['rarity'];
  status: PinStatus;
  parkCategory?: 'mountain' | 'waterfall' | 'marine' | 'forest';
};

export const mockUserPins: PinWithStatus[] = [
  { ...pins[0]!,  rarity: 'rare',      status: 'claimed',         parkCategory: 'mountain' },
  { ...pins[1]!,  rarity: 'common',    status: 'delivered',       parkCategory: 'forest' },
  { ...pins[2]!,  rarity: 'uncommon',  status: 'claim_available', parkCategory: 'waterfall' },
  { ...pins[3]!,  rarity: 'epic',      status: 'unlocked',        parkCategory: 'marine' },
  { ...pins[4]!,  rarity: 'rare',      status: 'locked',          parkCategory: 'mountain' },
  { ...pins[5]!,  rarity: 'common',    status: 'locked',          parkCategory: 'mountain' },
  { ...pins[6]!,  rarity: 'uncommon',  status: 'locked',          parkCategory: 'waterfall' },
  { ...pins[7]!,  rarity: 'rare',      status: 'locked',          parkCategory: 'marine' },
  { ...pins[8]!,  rarity: 'common',    status: 'locked',          parkCategory: 'waterfall' },
  { ...pins[9]!,  rarity: 'uncommon',  status: 'locked',          parkCategory: 'marine' },
  { ...pins[10]!, rarity: 'legendary', status: 'locked',          parkCategory: undefined },
];

// Mock pin claims
export const mockPinClaims: PinClaim[] = [
  {
    id: 'claim-001',
    userId: 'user-001',
    pinId: 'pin-001',
    userBadgeId: 'ub-001',
    status: 'claimed',
    shippingName: 'Chayachai Explorer',
    shippingAddress: '123 ถนนสุขุมวิท กรุงเทพมหานคร 10110',
    trackingNumber: null,
    claimedAt: '2026-04-01T10:00:00Z',
    shippedAt: null,
    deliveredAt: null,
  },
];
