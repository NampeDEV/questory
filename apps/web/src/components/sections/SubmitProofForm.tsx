'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// FE-COMP-SUBMIT-PROOF-FORM (SPEC-08) — TASK-011
// Extracted form logic; parent page provides missionId + onSuccess callback.

type FormState = {
  photo: File | null;
  travelDate: string;
  note: string;
  sharePermission: boolean;
  safetyAcknowledged: boolean;
};

type UIState = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

type SubmitProofFormProps = {
  missionId: string;
  onSuccess?: () => void;
};

const INITIAL_STATE: FormState = {
  photo: null,
  travelDate: '',
  note: '',
  sharePermission: false,
  safetyAcknowledged: false,
};

function validate(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.photo)       errs['photo'] = 'กรุณาแนบรูปหลักฐาน';
  if (!form.travelDate)  errs['travelDate'] = 'กรุณาระบุวันที่เดินทาง';
  if (form.travelDate && form.travelDate > new Date().toISOString().slice(0, 10))
                         errs['travelDate'] = 'วันที่ต้องไม่เกินวันนี้';
  if (!form.safetyAcknowledged) errs['safety'] = 'กรุณายืนยันความปลอดภัย';
  return errs;
}

export function SubmitProofForm({ missionId: _missionId, onSuccess }: SubmitProofFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uiState, setUiState] = useState<UIState>('idle');
  // Track current blob URL so we can revoke it when a new file is selected or the component unmounts.
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'ไฟล์ต้องมีขนาดไม่เกิน 5 MB' }));
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: 'รองรับเฉพาะ JPG / PNG' }));
      return;
    }
    setErrors((prev) => { const next = { ...prev }; delete next['photo']; return next; });
    setForm((prev) => ({ ...prev, photo: file }));
    // Revoke previous blob URL before creating a new one
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const newUrl = URL.createObjectURL(file);
    blobUrlRef.current = newUrl;
    setPhotoPreview(newUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUiState('validating');
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setUiState('idle');
      return;
    }
    setErrors({});
    setUiState('submitting');
    // POC: simulate POST /api/submit-proof
    await new Promise<void>((r) => setTimeout(r, 1200));
    setUiState('success');
    onSuccess?.();
  }

  if (uiState === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle size={48} className="text-success" />
        <h2 className="font-display text-xl font-bold text-forest-900">ส่งหลักฐานสำเร็จ!</h2>
        <p className="text-sm text-muted">อยู่ระหว่างรอการตรวจสอบจากแอดมิน</p>
      </div>
    );
  }

  const isSubmitting = uiState === 'submitting' || uiState === 'validating';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Photo upload */}
      <div>
        <label className="block text-sm font-semibold text-forest-900">
          รูปหลักฐาน <span className="text-danger">*</span>
          <span className="ml-1 text-xs font-normal text-muted">(JPG/PNG ≤ 5 MB)</span>
        </label>
        <label
          htmlFor="photo-upload"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-forest-700/30 bg-sand-100/50 p-6 transition-colors hover:border-forest-700 hover:bg-sand-100"
        >
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <Camera size={32} className="text-forest-700" aria-hidden="true" />
              <span className="mt-2 text-sm text-muted">แตะเพื่อเลือกรูป หรือถ่ายจากกล้อง</span>
            </>
          )}
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            className="sr-only"
            onChange={handlePhotoChange}
          />
        </label>
        {errors['photo'] && <p className="mt-1 text-xs text-danger">{errors['photo']}</p>}
      </div>

      {/* Travel date */}
      <div>
        <label htmlFor="travel-date" className="block text-sm font-semibold text-forest-900">
          วันที่เดินทาง <span className="text-danger">*</span>
        </label>
        <input
          id="travel-date"
          type="date"
          value={form.travelDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setForm((prev) => ({ ...prev, travelDate: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        />
        {errors['travelDate'] && <p className="mt-1 text-xs text-danger">{errors['travelDate']}</p>}
      </div>

      {/* GPS note */}
      <div className="flex items-start gap-2 rounded-xl bg-forest-800/5 p-3 text-sm text-muted">
        <MapPin size={16} className="mt-0.5 flex-shrink-0 text-forest-700" aria-hidden="true" />
        <span>พิกัดจะถูกบันทึกอัตโนมัติหากเปิดใช้ GPS ในขณะส่ง (POC: จำลอง)</span>
      </div>

      {/* Memory note */}
      <div>
        <label htmlFor="proof-memory-note" className="block text-sm font-semibold text-forest-900">
          บันทึกความทรงจำ <span className="text-xs font-normal text-muted">(ไม่บังคับ ≤ 2,000 ตัวอักษร)</span>
        </label>
        <textarea
          id="proof-memory-note"
          value={form.note}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
          maxLength={2000}
          rows={3}
          className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          placeholder="เล่าประสบการณ์การเดินทางของคุณ..."
        />
        <p className="mt-1 text-right text-xs text-muted">{form.note.length}/2000</p>
      </div>

      {/* Share permission */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={form.sharePermission}
          onChange={(e) => setForm((prev) => ({ ...prev, sharePermission: e.target.checked }))}
          className="mt-0.5 h-4 w-4 accent-forest-700"
        />
        <span className="text-sm text-ink">ยินยอมให้แชร์รูปและบันทึกใน Memory Wall สาธารณะ</span>
      </label>

      {/* Safety banner — RULE-007 / AC-APP-008 */}
      <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-danger" aria-hidden="true" />
          <div className="text-sm text-ink">
            <p className="font-semibold text-danger">ประกาศความปลอดภัย</p>
            {/* AC-APP-008: verbatim safety text required */}
            <p className="mt-1 text-muted">
              ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge
            </p>
          </div>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={form.safetyAcknowledged}
            onChange={(e) => setForm((prev) => ({ ...prev, safetyAcknowledged: e.target.checked }))}
            className="h-4 w-4 accent-forest-700"
          />
          <span className="text-sm font-semibold text-ink">ฉันรับทราบและปฏิบัติตามกฎอุทยานแล้ว</span>
        </label>
        {errors['safety'] && <p className="mt-1 text-xs text-danger">{errors['safety']}</p>}
      </div>

      <Button type="submit" variant="gold" className="w-full" isLoading={isSubmitting}>
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
        ส่งหลักฐาน
      </Button>
    </form>
  );
}
