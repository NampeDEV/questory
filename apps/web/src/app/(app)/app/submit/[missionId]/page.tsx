'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Camera, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type UIState = 'idle' | 'submitting' | 'success' | 'error';

// FE-COMP-SUBMIT / FE-PAGE-SUBMIT (SPEC-08)
export default function SubmitProofPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.missionId as string;

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [sharePermission, setSharePermission] = useState(false);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uiState, setUiState] = useState<UIState>('idle');

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
    setErrors((prev) => { const next = { ...prev }; delete next.photo; return next; });
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!photo)           errs.photo = 'กรุณาแนบรูปหลักฐาน';
    if (!travelDate)      errs.travelDate = 'กรุณาระบุวันที่เดินทาง';
    if (travelDate && travelDate > new Date().toISOString().slice(0, 10))
                          errs.travelDate = 'วันที่ต้องไม่เกินวันนี้';
    if (!safetyAcknowledged) errs.safety = 'กรุณายืนยันความปลอดภัย';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setUiState('submitting');
    // POC: simulate POST /api/submit-proof
    await new Promise((r) => setTimeout(r, 1200));
    setUiState('success');
    setTimeout(() => router.push(`/app/missions/${missionId}`), 1800);
  }

  if (uiState === 'success') {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-success" />
          <h2 className="mt-4 font-display text-xl font-bold text-forest-900">ส่งหลักฐานสำเร็จ!</h2>
          <p className="mt-2 text-sm text-muted">อยู่ระหว่างรอการตรวจสอบจากแอดมิน</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-forest-900">ส่งหลักฐาน</h1>
        <p className="mt-1 text-sm text-muted">แนบรูปถ่ายและข้อมูลเพื่อยืนยันการทำภารกิจ</p>
      </div>

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
          {errors.photo && <p className="mt-1 text-xs text-danger">{errors.photo}</p>}
        </div>

        {/* Travel date */}
        <div>
          <label htmlFor="travel-date" className="block text-sm font-semibold text-forest-900">
            วันที่เดินทาง <span className="text-danger">*</span>
          </label>
          <input
            id="travel-date"
            type="date"
            value={travelDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setTravelDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
          {errors.travelDate && <p className="mt-1 text-xs text-danger">{errors.travelDate}</p>}
        </div>

        {/* Location note */}
        <div className="flex items-start gap-2 rounded-xl bg-forest-800/5 p-3 text-sm text-muted">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-forest-700" aria-hidden="true" />
          <span>พิกัดจะถูกบันทึกอัตโนมัติหากเปิดใช้ GPS ในขณะส่ง (POC: จำลอง)</span>
        </div>

        {/* Memory note */}
        <div>
          <label htmlFor="memory-note" className="block text-sm font-semibold text-forest-900">
            บันทึกความทรงจำ <span className="text-xs font-normal text-muted">(ไม่บังคับ ≤ 2,000 ตัวอักษร)</span>
          </label>
          <textarea
            id="memory-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2000}
            rows={3}
            className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            placeholder="เล่าประสบการณ์การเดินทางของคุณ..."
          />
          <p className="mt-1 text-right text-xs text-muted">{note.length}/2000</p>
        </div>

        {/* Share permission */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={sharePermission}
            onChange={(e) => setSharePermission(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-forest-700"
          />
          <span className="text-sm text-ink">
            ยินยอมให้แชร์รูปและบันทึกใน Memory Wall สาธารณะ
          </span>
        </label>

        {/* Safety banner — RULE-007 */}
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-danger" aria-hidden="true" />
            <div className="text-sm text-ink">
              <p className="font-semibold text-danger">ประกาศความปลอดภัย</p>
              <p className="mt-1 text-muted">
                ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge
              </p>
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={safetyAcknowledged}
              onChange={(e) => setSafetyAcknowledged(e.target.checked)}
              className="h-4 w-4 accent-forest-700"
            />
            <span className="text-sm font-semibold text-ink">ฉันรับทราบและปฏิบัติตามกฎอุทยานแล้ว</span>
          </label>
          {errors.safety && <p className="mt-1 text-xs text-danger">{errors.safety}</p>}
        </div>

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          isLoading={uiState === 'submitting'}
        >
          ส่งหลักฐาน
        </Button>
      </form>
    </div>
  );
}
