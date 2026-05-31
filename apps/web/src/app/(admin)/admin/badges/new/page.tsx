'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-045b — Create new Badge / Pin form

const RARITY_OPTIONS = [
  { value: 'common',    label: 'Common' },
  { value: 'uncommon',  label: 'Uncommon' },
  { value: 'rare',      label: 'Rare' },
  { value: 'epic',      label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

type FormState = {
  name: string;
  nameEn: string;
  type: 'badge' | 'pin';
  rarity: string;
  missionLinked: string;
  stock: string;
  description: string;
  status: 'draft' | 'active';
};

const INITIAL: FormState = {
  name: '',
  nameEn: '',
  type: 'badge',
  rarity: 'uncommon',
  missionLinked: '',
  stock: '',
  description: '',
  status: 'draft',
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อ Badge / Pin';
  if (!form.rarity) errors.rarity = 'กรุณาเลือก Rarity';
  if (form.type === 'pin' && (!form.stock || Number(form.stock) < 0)) errors.stock = 'กรุณากรอกจำนวนสต็อก';
  return errors;
}

export default function NewBadgePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSave() {
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSaving(true);
    // Mock save — replace with POST /api/admin/badges when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/badges'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/badges" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          คลัง Badge &amp; Pin
        </Link>
        <span>/</span>
        <span className="text-ink">เพิ่ม Badge / Pin ใหม่</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">เพิ่ม Badge / Pin ใหม่</h1>
          <p className="mt-1 text-sm text-muted">กรอกข้อมูลและบันทึกเป็น Draft ก่อน Publish</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่คลัง Badge &amp; Pin…
        </div>
      )}

      <div className="space-y-5">
        <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>

          {/* Type toggle */}
          <div className="mb-4 flex gap-3">
            {(['badge', 'pin'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  form.type === t
                    ? 'bg-forest-800 text-white'
                    : 'border border-forest-800/20 text-muted hover:bg-sand-100'
                }`}
              >
                {t === 'badge' ? 'Digital Badge' : 'Physical Pin'}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-forest-900">ชื่อ (TH) <span className="text-danger">*</span></label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={form.type === 'badge' ? 'Badge นักพิชิต' : 'Pin ลายดอยอินทนนท์'} className={inputClass('name')} />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ชื่อ (EN)</label>
              <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} placeholder="Explorer Badge" className={inputClass('nameEn')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">Rarity <span className="text-danger">*</span></label>
              <select value={form.rarity} onChange={(e) => set('rarity', e.target.value)} className={inputClass('rarity')}>
                {RARITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.rarity && <p className="mt-1 text-xs text-danger">{errors.rarity}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ภารกิจที่ผูก</label>
              <input type="text" value={form.missionLinked} onChange={(e) => set('missionLinked', e.target.value)} placeholder="ยอดดอยอินทนนท์" className={inputClass('missionLinked')} />
            </div>

            {form.type === 'pin' && (
              <div>
                <label className="block text-xs font-medium text-forest-900">สต็อกเริ่มต้น <span className="text-danger">*</span></label>
                <input type="number" min={0} value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="50" className={inputClass('stock')} />
                {errors.stock && <p className="mt-1 text-xs text-danger">{errors.stock}</p>}
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-forest-900">คำอธิบาย</label>
              <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass('description')} resize-none`} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-forest-800/8 pt-4">
            <input
              id="badge-status"
              type="checkbox"
              checked={form.status === 'active'}
              onChange={(e) => set('status', e.target.checked ? 'active' : 'draft')}
              className="h-4 w-4 rounded border-forest-800/30 accent-forest-800"
            />
            <label htmlFor="badge-status" className="text-xs font-medium text-ink">เผยแพร่ทันที (Active)</label>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/admin/badges" className="rounded-xl border border-forest-800/20 px-5 py-2.5 text-sm font-medium text-muted hover:bg-sand-100">
            ยกเลิก
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || saved}
            className="flex items-center gap-2 rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  );
}
