'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-042c — Create new Mission form

const DIFFICULTY_OPTIONS = [
  { value: 'easy',   label: 'ง่าย' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'hard',   label: 'ยาก' },
];

const CATEGORY_OPTIONS = [
  { value: 'mountain', label: 'ยอดเขา' },
  { value: 'waterfall', label: 'น้ำตก' },
  { value: 'forest',   label: 'ป่าดงดิบ' },
  { value: 'marine',   label: 'ทางทะเล' },
  { value: 'wildlife', label: 'สัตว์ป่า' },
  { value: 'culture',  label: 'วัฒนธรรม' },
];

const REGION_OPTIONS = [
  { value: 'north',     label: 'ภาคเหนือ' },
  { value: 'central',   label: 'ภาคกลาง' },
  { value: 'northeast', label: 'ภาคอีสาน' },
  { value: 'east',      label: 'ภาคตะวันออก' },
  { value: 'south',     label: 'ภาคใต้' },
];

const OBJECTIVE_OPTIONS = [
  { value: 'photo',   label: 'ถ่ายรูปสถานที่' },
  { value: 'checkin', label: 'Check-in จุดหมาย' },
  { value: 'video',   label: 'บันทึกวิดีโอ' },
];

type FormState = {
  name: string;
  nameEn: string;
  park: string;
  region: string;
  difficulty: string;
  category: string;
  description: string;
  estimatedMinutes: string;
  reward: string;
  badgeName: string;
  objectiveType: string;
  status: 'draft' | 'active';
};

const INITIAL: FormState = {
  name: '',
  nameEn: '',
  park: '',
  region: '',
  difficulty: 'easy',
  category: 'mountain',
  description: '',
  estimatedMinutes: '',
  reward: '',
  badgeName: '',
  objectiveType: 'photo',
  status: 'draft',
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อภารกิจ';
  if (!form.park.trim()) errors.park = 'กรุณากรอกชื่ออุทยาน';
  if (!form.region) errors.region = 'กรุณาเลือกภาค';
  if (!form.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
  if (!form.estimatedMinutes || Number(form.estimatedMinutes) <= 0) errors.estimatedMinutes = 'กรุณากรอกเวลาโดยประมาณ';
  if (!form.badgeName.trim()) errors.badgeName = 'กรุณากรอกชื่อ Badge';
  return errors;
}

export default function NewMissionPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSave(publishNow = false) {
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSaving(true);
    // Mock save — replace with POST /api/admin/missions when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    if (publishNow) set('status', 'active');
    setTimeout(() => router.push('/admin/missions'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/missions" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          Mission / จุดหมาย
        </Link>
        <span>/</span>
        <span className="text-ink">เพิ่มภารกิจใหม่</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">เพิ่มภารกิจใหม่</h1>
          <p className="mt-1 text-sm text-muted">กรอกรายละเอียดภารกิจแล้วบันทึกเป็น Draft ก่อน Publish</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่รายการภารกิจ…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Basic info */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อภารกิจ (TH) <span className="text-danger">*</span></label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="เช่น ยอดดอยอินทนนท์" className={inputClass('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อภารกิจ (EN)</label>
                <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} placeholder="Doi Inthanon Summit" className={inputClass('nameEn')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">อุทยาน <span className="text-danger">*</span></label>
                <input type="text" value={form.park} onChange={(e) => set('park', e.target.value)} placeholder="เช่น ดอยอินทนนท์" className={inputClass('park')} />
                {errors.park && <p className="mt-1 text-xs text-danger">{errors.park}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ภาค <span className="text-danger">*</span></label>
                <select value={form.region} onChange={(e) => set('region', e.target.value)} className={inputClass('region')}>
                  <option value="">— เลือกภาค —</option>
                  {REGION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {errors.region && <p className="mt-1 text-xs text-danger">{errors.region}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ระดับความยาก</label>
                <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={inputClass('difficulty')}>
                  {DIFFICULTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">หมวดหมู่</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass('category')}>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-forest-900">คำอธิบาย <span className="text-danger">*</span></label>
              <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="อธิบายรายละเอียดภารกิจ" className={`${inputClass('description')} resize-none`} />
              {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
            </div>
          </section>

          {/* Objective */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">วัตถุประสงค์ & เวลา</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">ประเภท Objective</label>
                <select value={form.objectiveType} onChange={(e) => set('objectiveType', e.target.value)} className={inputClass('objectiveType')}>
                  {OBJECTIVE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">เวลาโดยประมาณ (นาที) <span className="text-danger">*</span></label>
                <input type="number" min={1} value={form.estimatedMinutes} onChange={(e) => set('estimatedMinutes', e.target.value)} placeholder="60" className={inputClass('estimatedMinutes')} />
                {errors.estimatedMinutes && <p className="mt-1 text-xs text-danger">{errors.estimatedMinutes}</p>}
              </div>
            </div>
          </section>

          {/* Reward */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รางวัล</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อ Badge <span className="text-danger">*</span></label>
                <input type="text" value={form.badgeName} onChange={(e) => set('badgeName', e.target.value)} placeholder="นักพิชิต" className={inputClass('badgeName')} />
                {errors.badgeName && <p className="mt-1 text-xs text-danger">{errors.badgeName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">คำอธิบายรางวัล</label>
                <input type="text" value={form.reward} onChange={(e) => set('reward', e.target.value)} placeholder="Badge นักพิชิต" className={inputClass('reward')} />
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">การเผยแพร่</h2>
            <div className="flex items-center gap-2">
              <input
                id="status-active"
                type="checkbox"
                checked={form.status === 'active'}
                onChange={(e) => set('status', e.target.checked ? 'active' : 'draft')}
                className="h-4 w-4 rounded border-forest-800/30 accent-forest-800"
              />
              <label htmlFor="status-active" className="text-xs font-medium text-ink">เผยแพร่ทันที (Active)</label>
            </div>
            <p className="mt-2 text-[11px] text-muted">หากไม่เลือก ภารกิจจะถูกบันทึกเป็น Draft</p>
          </section>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'กำลังบันทึก…' : 'บันทึก Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-forest-800/30 px-4 py-2.5 text-sm font-semibold text-forest-800 hover:bg-sand-100 disabled:opacity-50"
          >
            บันทึก &amp; Publish
          </button>
        </div>
      </div>
    </div>
  );
}
