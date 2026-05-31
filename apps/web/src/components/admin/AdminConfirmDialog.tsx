'use client';

// ADMIN-CONFIRM — confirmation dialog for destructive / important admin actions
// Usage:
//   <AdminConfirmDialog
//     open={open}
//     onClose={() => setOpen(false)}
//     onConfirm={handleDelete}
//     title="ลบบอร์ด?"
//     description="การลบบอร์ดจะไม่สามารถกู้คืนได้"
//     variant="danger"
//     confirmLabel="ลบ"
//   />

import { Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';
import { AdminModal } from './AdminModal';
import { cn } from '@/lib/utils/cn';

type Variant = 'danger' | 'warning' | 'success' | 'info';

type AdminConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Async or sync callback — dialog waits for promise to resolve */
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
};

const VARIANT_CONFIG: Record<Variant, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  confirmClass: string;
}> = {
  danger: {
    icon: AlertTriangle,
    iconClass: 'bg-danger/10 text-danger',
    confirmClass: 'bg-danger text-white hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-gold-100 text-gold-700',
    confirmClass: 'bg-gold-500 text-forest-950 hover:bg-gold-400',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-success/10 text-success',
    confirmClass: 'bg-success text-white hover:bg-green-700',
  },
  info: {
    icon: Info,
    iconClass: 'bg-blue-50 text-blue-600',
    confirmClass: 'bg-forest-800 text-white hover:bg-forest-700',
  },
};

export function AdminConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  variant = 'info',
}: AdminConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      disableBackdropClose={loading}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-forest-800/20 px-4 py-2 text-sm font-medium text-muted hover:bg-sand-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50',
              config.confirmClass,
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full', config.iconClass)}>
          <Icon size={20} />
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
    </AdminModal>
  );
}
