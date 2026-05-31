// ADMIN-005 (TASK_ADMIN) — status badge with color mapping
import { cn } from '@/lib/utils/cn';

type StatusVariant =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'draft'
  | 'claimed'
  | 'locked'
  | 'available'
  | 'low_stock'
  | 'out_of_stock'
  | 'open'
  | 'resolved'
  | 'in_progress';

type AdminStatusBadgeProps = {
  status: StatusVariant | string;
  className?: string;
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  submitted:    { label: 'รอตรวจสอบ',   className: 'bg-gold-500/15 text-gold-700 border-gold-500/30' },
  approved:     { label: 'อนุมัติแล้ว',  className: 'bg-success/10 text-success border-success/30' },
  rejected:     { label: 'ปฏิเสธแล้ว',  className: 'bg-danger/10 text-danger border-danger/30' },
  pending:      { label: 'รอดำเนินการ',  className: 'bg-gold-500/15 text-gold-700 border-gold-500/30' },
  paid:         { label: 'ชำระแล้ว',    className: 'bg-success/10 text-success border-success/30' },
  processing:   { label: 'กำลังดำเนินการ', className: 'bg-forest-700/10 text-forest-700 border-forest-700/30' },
  shipped:      { label: 'จัดส่งแล้ว',  className: 'bg-forest-700/10 text-forest-700 border-forest-700/30' },
  delivered:    { label: 'ส่งสำเร็จ',   className: 'bg-success/10 text-success border-success/30' },
  cancelled:    { label: 'ยกเลิก',      className: 'bg-danger/10 text-danger border-danger/30' },
  active:       { label: 'เปิดใช้งาน',  className: 'bg-success/10 text-success border-success/30' },
  inactive:     { label: 'ปิดใช้งาน',   className: 'bg-muted/10 text-muted border-muted/30' },
  draft:        { label: 'ร่าง',        className: 'bg-muted/10 text-muted border-muted/30' },
  claimed:      { label: 'Claimed',     className: 'bg-forest-700/10 text-forest-700 border-forest-700/30' },
  locked:       { label: 'ล็อก',        className: 'bg-muted/10 text-muted border-muted/30' },
  available:    { label: 'พร้อมใช้งาน', className: 'bg-success/10 text-success border-success/30' },
  low_stock:    { label: 'ใกล้หมด',     className: 'bg-gold-500/15 text-gold-700 border-gold-500/30' },
  out_of_stock: { label: 'หมด',         className: 'bg-danger/10 text-danger border-danger/30' },
  open:         { label: 'เปิด',        className: 'bg-gold-500/15 text-gold-700 border-gold-500/30' },
  resolved:     { label: 'แก้ไขแล้ว',  className: 'bg-success/10 text-success border-success/30' },
  in_progress:  { label: 'กำลังดำเนินการ', className: 'bg-forest-700/10 text-forest-700 border-forest-700/30' },
};

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: 'bg-muted/10 text-muted border-muted/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
