// Status-to-color map — never inline inside components (SPEC-08 FE-STATE)
import type { MissionStatus } from '@/types/mission';
import type { PinStatus } from '@/types/pin';
import type { OrderStatus } from '@/types/order';

type StyleMap = { label: string; className: string };

export const missionStatusStyle: Record<MissionStatus, StyleMap> = {
  locked:         { label: 'ล็อก',            className: 'bg-sand-200 text-muted' },
  available:      { label: 'พร้อมทำ',          className: 'bg-success/10 text-success' },
  in_progress:    { label: 'กำลังทำ',          className: 'bg-gold-500/10 text-gold-500' },
  submitted:      { label: 'รอตรวจสอบ',        className: 'bg-[#7B5BA6]/10 text-[#7B5BA6]' },
  approved:       { label: 'อนุมัติแล้ว',       className: 'bg-success/10 text-success' },
  need_more_info: { label: 'ต้องข้อมูลเพิ่ม',  className: 'bg-gold-500/10 text-gold-500' },
  rejected:       { label: 'ไม่ผ่าน',          className: 'bg-danger/10 text-danger' },
  completed:      { label: 'สำเร็จ',           className: 'bg-success text-white' },
};

export const pinStatusStyle: Record<PinStatus, StyleMap> = {
  locked:          { label: 'ล็อก',       className: 'bg-sand-200 text-muted' },
  unlocked:        { label: 'ปลดล็อก',    className: 'bg-success/10 text-success' },
  claim_available: { label: 'Claim ได้',  className: 'bg-gold-500 text-forest-950' },
  claimed:         { label: 'Claimed',    className: 'bg-forest-800/10 text-forest-800' },
  shipped:         { label: 'จัดส่งแล้ว', className: 'bg-[#5F9080]/10 text-[#5F9080]' },
  delivered:       { label: 'ได้รับแล้ว', className: 'bg-success text-white' },
};

export const orderStatusStyle: Record<OrderStatus, StyleMap> = {
  draft:      { label: 'ร่าง',        className: 'bg-sand-200 text-muted' },
  paid:       { label: 'ชำระแล้ว',    className: 'bg-success/10 text-success' },
  processing: { label: 'กำลังดำเนินการ', className: 'bg-gold-500/10 text-gold-500' },
  shipped:    { label: 'จัดส่งแล้ว',  className: 'bg-[#5F9080]/10 text-[#5F9080]' },
  delivered:  { label: 'ได้รับแล้ว',  className: 'bg-success text-white' },
  cancelled:  { label: 'ยกเลิก',      className: 'bg-danger/10 text-danger' },
};
