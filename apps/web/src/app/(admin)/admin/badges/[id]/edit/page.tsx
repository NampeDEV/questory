'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-045c — Edit Badge / Pin page

const RARITY_OPTIONS = [
  { value: 'common',    label: 'Common' },
  { value: 'uncommon',  label: 'Uncommon' },
  { value: 'rare',      label: 'Rare' },
  { value: 'epic',      label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

// Mock lookup — replace with GET /api/admin/badges/:id when Supabase is wired
const MOCK_BADGE_BY_ID: Record<string, {
  name: string; nameEn: string; type: 'badge' | 'pin';
  rarity: string; missionLinked: string; stock: string; description: string; status: 'draft' | 'active' | 'out_of_stock';
}> = {
  'BDG-001': { name: 'Badge นักพิชิตดอย',       nameEn: 'Mountain Conqueror Badge', type: 'badge', rarity: 'epic',     missionLinked: 'ยอดดอยอินทนนท์', stock: '',   description: 'รับเมื่อพิชิตยอดดอยอินทนนท์ได้สำเร็จ', status: 'active' },
  'BDG-002': { name: 'Badge สายน้ำ',             nameEn: 'Waterfall Badge',          type: 'badge', rarity: 'uncommon', missionLinked: 'น้ำตกวชิรธาร',    stock: '',   description: 'รับเมื่อเยี่ยมชมน้ำตกวชิรธาร', status: 'active' },
  'PIN-001': { name: 'Pin ลายดอยอินทนนท์',      nameEn: 'Doi Inthanon Pin',         type: 'pin',   rarity: 'rare',     missionLinked: 'ยอดดอยอินทนนท์', stock: '18',  description: 'Physical pin สำหรับผู้พิชิตดอยอินทนนท์', status: 'active' },
  'PIN-002': { name: 'Pin ลายเขาใหญ่',           nameEn: 'Khao Yai Pin',             type: 'pin',   rarity: 'uncommon', missionLinked: 'ป่าดงดิบเขาใหญ่', stock: '22',  description: 'Physical pin ที่ระลึกเขาใหญ่', status: 'active' },
  'PIN-003': { name: 'Pin ลายทะเลสิมิลัน',      nameEn: 'Similan Sea Pin',          type: 'pin',   rarity: 'rare',     missionLinked: 'หาดปอมจ้า',       stock: '0',   description: 'หมดสต็อกชั่วคราว', status: 'out_of_stock' },
  'BDG-003': { name: 'Badge ตำนาน Explorer',     nameEn: 'Legend Explorer Badge',    type: 'badge', rarity: 'legendary', missionLinked: '',               stock: '',   description: 'Badge พิเศษสำหรับผู้สำเร็จครบทุก Quest', status: 'draft' },
};

type FormState = {
  name: string;
  nameEn: string;
  type: 'badge' | 'pin';
  rarity: string;
  missionLinked: string;
  stock: string;
  description: string;
  status: 'draft' | 'active' | 'out_of_stock';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อ Badge / Pin';
  if (!form.rarity) errors.rarity = 'กรุณาเลือก Rarity';
  if (form.type === 'pin' && (!form.stock || Number(form.stock) < 0)) errors.stock = 'กรุณากรอกจำนวนสต็อก';
  return errors;
}

export default function EditBadgePage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params['id'] === 'string' ? params['id'] : '';

  const seed = MOCK_BADGE_BY_ID[id] ?? {
    name: '', nameEn: '', type: 'badge' as const, rarity: 'uncommon',
    missionLinked: '', stock: '', description: '', status: 'draft' as const,
  };

  const [form, setForm] = useState<FormState>(seed);
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
    // Mock save — replace with PATCH /api/admin/badges/:id when Supabase is wired
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
        <span className="text-ink">แก้ไข Badge / Pin</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไข Badge / Pin</h1>
          <p className="font-mono text-xs text-muted">{id}</p>
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
          <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูล</h2>

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
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass('name')} />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ชื่อ (EN)</label>
              <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} className={inputClass('nameEn')} />
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
              <input type="text" value={form.missionLinked} onChange={(e) => set('missionLinked', e.target.value)} className={inputClass('missionLinked')} />
            </div>

            {form.type === 'pin' && (
              <div>
                <label className="block text-xs font-medium text-forest-900">สต็อกปัจจุบัน <span className="text-danger">*</span></label>
                <input type="number" min={0} value={form.stock} onChange={(e) => set('stock', e.target.value)} className={inputClass('stock')} />
                {errors.stock && <p className="mt-1 text-xs text-danger">{errors.stock}</p>}
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-forest-900">คำอธิบาย</label>
              <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass('description')} resize-none`} />
            </div>
          </div>

          <div className="mt-4 border-t border-forest-800/8 pt-4">
            <label className="block text-xs font-medium text-forest-900 mb-2">สถานะ</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as FormState['status'])}
              className={inputClass('status')}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
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
