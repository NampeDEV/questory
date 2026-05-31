'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-040c — Edit Board page

const REGION_OPTIONS = [
  { value: 'north',     label: 'ภาคเหนือ' },
  { value: 'central',   label: 'ภาคกลาง' },
  { value: 'northeast', label: 'ภาคอีสาน' },
  { value: 'east',      label: 'ภาคตะวันออก' },
  { value: 'south',     label: 'ภาคใต้' },
];

const CATEGORY_OPTIONS = [
  { value: 'starter',  label: 'Starter' },
  { value: 'regional', label: 'Regional' },
  { value: 'ultimate', label: 'Ultimate' },
  { value: 'custom',   label: 'Custom' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
];

// Mock lookup by id — replace with GET /api/admin/boards/:id when Supabase is wired
const MOCK_BOARD_BY_ID: Record<string, {
  name: string; nameEn: string; park: string; region: string;
  category: string; difficulty: string; priceThb: string;
  description: string; descriptionEn: string; questCount: string;
  status: 'draft' | 'active';
}> = {
  'BRD-001': { name: 'บอร์ดดอยอินทนนท์', nameEn: 'Doi Inthanon Board', park: 'ดอยอินทนนท์', region: 'north', category: 'regional', difficulty: 'medium', priceThb: '1290', description: 'ตะลุยภารกิจบนยอดดอยที่สูงที่สุดในไทย', descriptionEn: 'Conquer missions at Thailand\'s highest peak.', questCount: '8', status: 'active' },
  'BRD-002': { name: 'บอร์ดเขาใหญ่ Explorer', nameEn: 'Khao Yai Explorer', park: 'เขาใหญ่', region: 'central', category: 'starter', difficulty: 'easy', priceThb: '990', description: 'สำรวจป่าดิบชื้นมรดกโลกเขาใหญ่', descriptionEn: 'Explore the UNESCO World Heritage jungle.', questCount: '6', status: 'active' },
  'BRD-003': { name: 'บอร์ดสิมิลัน Diver', nameEn: 'Similan Diver', park: 'หมู่เกาะสิมิลัน', region: 'south', category: 'regional', difficulty: 'hard', priceThb: '1590', description: 'ดำดิ่งสู่โลกใต้น้ำสิมิลันอันงดงาม', descriptionEn: 'Dive into the spectacular Similan underwater world.', questCount: '5', status: 'active' },
  'BRD-004': { name: 'บอร์ดภูกระดึง', nameEn: 'Phu Kradueng Board', park: 'ภูกระดึง', region: 'northeast', category: 'ultimate', difficulty: 'hard', priceThb: '1890', description: 'พิชิตภูกระดึงสุดท้าทาย', descriptionEn: 'Conquer the challenging Phu Kradueng plateau.', questCount: '6', status: 'draft' },
};

type FormState = {
  name: string; nameEn: string; park: string; region: string;
  category: string; difficulty: string; priceThb: string;
  description: string; descriptionEn: string; questCount: string;
  status: 'draft' | 'active';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อบอร์ด';
  if (!form.park.trim()) errors.park = 'กรุณากรอกชื่ออุทยาน';
  if (!form.region) errors.region = 'กรุณาเลือกภาค';
  if (!form.priceThb || Number(form.priceThb) <= 0) errors.priceThb = 'ราคาต้องมากกว่า 0';
  if (!form.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
  if (!form.questCount || Number(form.questCount) <= 0) errors.questCount = 'จำนวนภารกิจต้องมากกว่า 0';
  return errors;
}

export default function EditBoardPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params['id'] === 'string' ? params['id'] : '';

  const seed = MOCK_BOARD_BY_ID[id] ?? {
    name: '', nameEn: '', park: '', region: '', category: 'starter',
    difficulty: 'easy', priceThb: '', description: '', descriptionEn: '',
    questCount: '', status: 'draft' as const,
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
    // Mock save — replace with PATCH /api/admin/boards/:id when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/boards'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/boards" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          บอร์ดภารกิจ
        </Link>
        <span>/</span>
        <span className="text-ink">แก้ไขบอร์ด</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไขบอร์ด</h1>
          <p className="mt-1 text-sm text-muted">
            {id ? `ID: ${id}` : 'ไม่พบบอร์ดนี้'}
          </p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่รายการบอร์ด…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left — main fields */}
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่อบอร์ด (TH) <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="เช่น บอร์ดดอยอินทนนท์" className={inputClass('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อบอร์ด (EN)</label>
                <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)}
                  placeholder="e.g. Doi Inthanon Board" className={inputClass('nameEn')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่ออุทยาน <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.park} onChange={(e) => set('park', e.target.value)}
                  placeholder="เช่น ดอยอินทนนท์" className={inputClass('park')} />
                {errors.park && <p className="mt-1 text-xs text-danger">{errors.park}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ภาค <span className="text-danger">*</span>
                </label>
                <select value={form.region} onChange={(e) => set('region', e.target.value)}
                  className={inputClass('region')}>
                  <option value="">— เลือกภาค —</option>
                  {REGION_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {errors.region && <p className="mt-1 text-xs text-danger">{errors.region}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รายละเอียด</h2>
            <div>
              <label className="block text-xs font-medium text-forest-900">
                คำอธิบาย (TH) <span className="text-danger">*</span>
              </label>
              <textarea rows={3} value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="อธิบายบอร์ดนี้ให้ผู้ใช้เข้าใจ"
                className={inputClass('description')} />
              {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-forest-900">คำอธิบาย (EN)</label>
              <textarea rows={3} value={form.descriptionEn}
                onChange={(e) => set('descriptionEn', e.target.value)}
                placeholder="English description"
                className={inputClass('descriptionEn')} />
            </div>
          </section>
        </div>

        {/* Right — settings */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ตั้งค่า</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-forest-900">หมวดหมู่</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className={inputClass('category')}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ระดับความยาก</label>
                <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}
                  className={inputClass('difficulty')}>
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ราคา (THB) <span className="text-danger">*</span>
                </label>
                <input type="number" min="1" value={form.priceThb}
                  onChange={(e) => set('priceThb', e.target.value)}
                  placeholder="1290" className={inputClass('priceThb')} />
                {errors.priceThb && <p className="mt-1 text-xs text-danger">{errors.priceThb}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  จำนวนภารกิจ <span className="text-danger">*</span>
                </label>
                <input type="number" min="1" value={form.questCount}
                  onChange={(e) => set('questCount', e.target.value)}
                  placeholder="8" className={inputClass('questCount')} />
                {errors.questCount && <p className="mt-1 text-xs text-danger">{errors.questCount}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">การเผยแพร่</h2>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={form.status === 'active'}
                onChange={(e) => set('status', e.target.checked ? 'active' : 'draft')}
                className="h-4 w-4 rounded border-forest-800/30 text-forest-700 accent-forest-700" />
              <span className="text-sm text-ink">Active (เผยแพร่)</span>
            </label>
          </section>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-4 py-3 text-sm font-semibold text-white hover:bg-forest-700 disabled:opacity-60 transition-colors"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'กำลังบันทึก…' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </div>
    </div>
  );
}
