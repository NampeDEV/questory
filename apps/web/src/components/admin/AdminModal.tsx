'use client';

// ADMIN-MODAL — reusable modal/popup for admin pages
// Usage:
//   <AdminModal open={open} onClose={() => setOpen(false)} title="หัวข้อ">
//     …content…
//   </AdminModal>

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type AdminModalSize = 'sm' | 'md' | 'lg' | 'xl';

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: AdminModalSize;
  /** Footer slot — pass action buttons here */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Prevent closing by clicking the backdrop */
  disableBackdropClose?: boolean;
};

const SIZE_CLASS: Record<AdminModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function AdminModal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  disableBackdropClose = false,
}: AdminModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm"
        onClick={disableBackdropClose ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full rounded-2xl border border-forest-800/20 bg-white shadow-2xl',
          SIZE_CLASS[size],
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-forest-800/10 px-5 py-4">
          <div>
            <h2 id="admin-modal-title" className="font-semibold text-forest-900">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs text-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted hover:bg-sand-100 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-forest-800/10 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
