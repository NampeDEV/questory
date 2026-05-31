'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-042b — Edit Mission page

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

// Mock lookup — replace with GET /api/admin/missions/:id when Supabase is wired
const MOCK_MISSION_BY_ID: Record<string, {
  name: string; nameEn: string; park: string; region: string;
  difficulty: string; category: string; description: string;
  estimatedMinutes: string; reward: string; badgeName: string;
  objectiveType: string; status: 'draft' | 'active';
}> = {
  'MSN-001': { name: 'ยอดดอยอินทนนท์', nameEn: 'Doi Inthanon Summit', park: 'ดอยอินทนนท์', region: 'ภาคเหนือ', difficulty: 'hard', category: 'mountain', description: 'ขึ้นถึงยอดดอยสูงสุดในไทย ถ่ายภาพกับป้ายสูงสุด', estimatedMinutes: '240', reward: 'Badge นักพิชิต', badgeName: 'นักพิชิต', objectiveType: 'photo', status: 'active' },
  'MSN-002': { name: 'น้ำตกวชิรธาร', nameEn: 'Wachirathan Waterfall', park: 'ดอยอินทนนท์', region: 'ภาคเหนือ', difficulty: 'easy', category: 'waterfall', description: 'เดินทางไปถ่ายภาพน้ำตกวชิรธาร', estimatedMinutes: '60', reward: 'Badge สายน้ำ', badgeName: 'สายน้ำ', objectiveType: 'photo', status: 'active' },
  'MSN-003': { name: 'ป่าดงดิบเขาใหญ่', nameEn: 'Khao Yai Jungle Trail', park: 'เขาใหญ่', region: 'ภาคกลาง', difficulty: 'medium', category: 'forest', description: 'เดินป่าในเส้นทางธรรมชาติ', estimatedMinutes: '180', reward: 'Badge นักสำรวจ', badgeName: 'นักสำรวจ', objectiveType: 'checkin', status: 'active' },
  'MSN-004': { name: 'หาดปอมจ้า', nameEn: 'Hat Pom Cha Beach', park: 'หมู่เกาะสิมิลัน', region: 'ภาคใต้', difficulty: 'easy', category: 'marine', description: 'สำรวจชายหาดและดำน้ำดูปะการังที่สิมิลัน', estimatedMinutes: '120', reward: 'Badge นักดำน้ำ', badgeName: 'นักดำน้ำ', objectiveType: 'photo', status: 'active' },
  'MSN-005': { name: 'ยอดภูกระดึง', nameEn: 'Phu Kradueng Summit', park: 'ภูกระดึง', region: 'ภาคอีสาน', difficulty: 'hard', category: 'mountain', description: 'ขึ้นสู่ยอดผาภูกระดึง ความสูง 1,325 เมตร', estimatedMinutes: '300', reward: 'Badge ยอดเขา', badgeName: 'ยอดเขา', objectiveType: 'checkin', status: 'draft' },
};

type FormState = {
  name: string; nameEn: string; park: string; region: string;
  difficulty: string; category: string; description: string;
  estimatedMinutes: string; reward: string; badgeName: string;
  objectiveType: string; status: 'draft' | 'active';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อภารกิจ';
  if (!form.park.trim()) errors.park = 'กรุณากรอกชื่ออุทยาน';
  if (!form.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
  if (!form.estimatedMinutes || Number(form.estimatedMinutes) <= 0) errors.estimatedMinutes = 'กรุณากรอกเวลาโดยประมาณ';
  if (!form.badgeName.trim()) errors.badgeName = 'กรุณากรอกชื่อ Badge';
  return errors;
}

export default function EditMissionPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params['id'] === 'string' ? params['id'] : '';

  const seed = MOCK_MISSION_BY_ID[id] ?? {
    name: '', nameEn: '', park: '', region: '', difficulty: 'easy',
    category: 'mountain', description: '', estimatedMinutes: '',
    reward: '', badgeName: '', objectiveType: 'photo', status: 'draft' as const,
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
    // Mock save — replace with PATCH /api/admin/missions/:id when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
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
          Mission
        </Link>
        <span>/</span>
        <span className="text-ink">แก้ไขภารกิจ</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไขภารกิจ</h1>
          <p className="mt-1 text-sm text-muted">{id ? `ID: ${id}` : 'ไม่พบภารกิจนี้'}</p>
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
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่อภารกิจ (TH) <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="เช่น ยอดดอยอินทนนท์" className={inputClass('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อภารกิจ (EN)</label>
                <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)}
                  placeholder="e.g. Doi Inthanon Summit" className={inputClass('nameEn')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  อุทยาน <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.park} onChange={(e) => set('park', e.target.value)}
                  placeholder="ดอยอินทนนท์" className={inputClass('park')} />
                {errors.park && <p className="mt-1 text-xs text-danger">{errors.park}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ประเภทภารกิจ</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className={inputClass('category')}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รายละเอียด</h2>
            <div>
              <label className="block text-xs font-medium text-forest-900">
                คำอธิบายภารกิจ <span className="text-danger">*</span>
              </label>
              <textarea rows={3} value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="อธิบายสิ่งที่ต้องทำในภารกิจ"
                className={inputClass('description')} />
              {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รางวัล</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่อ Badge <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.badgeName} onChange={(e) => set('badgeName', e.target.value)}
                  placeholder="นักพิชิต" className={inputClass('badgeName')} />
                {errors.badgeName && <p className="mt-1 text-xs text-danger">{errors.badgeName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">คำอธิบายรางวัล</label>
                <input type="text" value={form.reward} onChange={(e) => set('reward', e.target.value)}
                  placeholder="Badge นักพิชิต" className={inputClass('reward')} />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ตั้งค่า</h2>
            <div className="space-y-4">
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
                <label className="block text-xs font-medium text-forest-900">ประเภทหลักฐาน</label>
                <select value={form.objectiveType} onChange={(e) => set('objectiveType', e.target.value)}
                  className={inputClass('objectiveType')}>
                  <option value="photo">ถ่ายภาพ</option>
                  <option value="checkin">Check-in GPS</option>
                  <option value="video">วิดีโอ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  เวลาโดยประมาณ (นาที) <span className="text-danger">*</span>
                </label>
                <input type="number" min="1" value={form.estimatedMinutes}
                  onChange={(e) => set('estimatedMinutes', e.target.value)}
                  placeholder="120" className={inputClass('estimatedMinutes')} />
                {errors.estimatedMinutes && <p className="mt-1 text-xs text-danger">{errors.estimatedMinutes}</p>}
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
