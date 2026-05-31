'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-041c — Edit Quest page

const MOCK_BOARDS = [
  { id: 'BRD-001', name: 'บอร์ดดอยอินทนนท์' },
  { id: 'BRD-002', name: 'บอร์ดเขาใหญ่ Explorer' },
  { id: 'BRD-003', name: 'บอร์ดสิมิลัน Diver' },
  { id: 'BRD-004', name: 'บอร์ดภูกระดึง' },
];

const OBJECTIVE_TYPES = [
  { value: 'photo',   label: 'ถ่ายรูปสถานที่' },
  { value: 'checkin', label: 'Check-in จุดหมาย' },
  { value: 'quiz',    label: 'ตอบคำถาม' },
  { value: 'hike',    label: 'เดินทางระยะทาง' },
];

// Mock lookup — replace with GET /api/admin/quests/:id when Supabase is wired
const MOCK_QUEST_BY_ID: Record<string, {
  name: string; nameEn: string; boardId: string;
  objectiveType: string; description: string; descriptionEn: string;
  badgeName: string; pinName: string; estimatedMinutes: string; status: 'draft' | 'active';
}> = {
  'QST-001': { name: 'พิชิตยอดดอยอินทนนท์', nameEn: 'Conquer Doi Inthanon Summit', boardId: 'BRD-001', objectiveType: 'photo', description: 'ขึ้นถึงยอดดอยและถ่ายภาพกับป้ายยอดสูงสุดในไทย', descriptionEn: 'Reach the summit and take a photo at the highest point marker.', badgeName: 'นักพิชิต', pinName: 'Pin ดอยอินทนนท์', estimatedMinutes: '240', status: 'active' },
  'QST-002': { name: 'Explorer เขาใหญ่', nameEn: 'Khao Yai Explorer', boardId: 'BRD-002', objectiveType: 'checkin', description: 'เดินป่าและ Check-in จุดสำคัญใน UNESCO World Heritage', descriptionEn: 'Hike and check-in at key points in this UNESCO World Heritage site.', badgeName: 'Explorer', pinName: '', estimatedMinutes: '180', status: 'active' },
  'QST-003': { name: 'สำรวจใต้ทะเลสิมิลัน', nameEn: 'Similan Underwater Explorer', boardId: 'BRD-003', objectiveType: 'photo', description: 'ดำน้ำและถ่ายภาพสิ่งมีชีวิตใต้ทะเลที่สิมิลัน', descriptionEn: 'Dive and photograph marine life at Similan Islands.', badgeName: 'นักดำน้ำ', pinName: 'Pin สิมิลัน', estimatedMinutes: '120', status: 'active' },
  'QST-004': { name: 'น้ำตกใจกลางป่า', nameEn: 'Waterfall in the Forest', boardId: 'BRD-001', objectiveType: 'photo', description: 'เดินทางสู่น้ำตกวชิรธารและถ่ายภาพ', descriptionEn: 'Trek to Wachirathan Waterfall and photograph it.', badgeName: 'สายน้ำ', pinName: '', estimatedMinutes: '90', status: 'active' },
  'QST-005': { name: 'ยอดภูกระดึงฤดูหนาว', nameEn: 'Phu Kradueng Winter Summit', boardId: 'BRD-004', objectiveType: 'checkin', description: 'ขึ้นภูกระดึงในฤดูหนาวและ Check-in ยอดผา', descriptionEn: 'Climb Phu Kradueng in winter and check-in at the summit cliff.', badgeName: 'ยอดเขา', pinName: 'Pin ภูกระดึง', estimatedMinutes: '300', status: 'draft' },
};

type FormState = {
  name: string;
  nameEn: string;
  boardId: string;
  objectiveType: string;
  description: string;
  descriptionEn: string;
  badgeName: string;
  pinName: string;
  estimatedMinutes: string;
  status: 'draft' | 'active';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อเควส';
  if (!form.boardId) errors.boardId = 'กรุณาเลือกบอร์ด';
  if (!form.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
  return errors;
}

export default function EditQuestPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params['id'] === 'string' ? params['id'] : '';

  const seed = MOCK_QUEST_BY_ID[id] ?? {
    name: '', nameEn: '', boardId: '', objectiveType: 'photo',
    description: '', descriptionEn: '', badgeName: '', pinName: '',
    estimatedMinutes: '', status: 'draft' as const,
  };

  const [form, setForm] = useState<FormState>(seed);
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
    // Mock save — replace with PATCH /api/admin/quests/:id when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    if (publishNow) set('status', 'active');
    setTimeout(() => router.push('/admin/quests'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/quests" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          เควส
        </Link>
        <span>/</span>
        <span className="text-ink">แก้ไขเควส</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไขเควส</h1>
          <p className="font-mono text-xs text-muted">{id}</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่รายการเควส…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อเควส (TH) <span className="text-danger">*</span></label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อเควส (EN)</label>
                <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} className={inputClass('nameEn')} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-forest-900">บอร์ด <span className="text-danger">*</span></label>
                <select value={form.boardId} onChange={(e) => set('boardId', e.target.value)} className={inputClass('boardId')}>
                  <option value="">— เลือกบอร์ด —</option>
                  {MOCK_BOARDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                {errors.boardId && <p className="mt-1 text-xs text-danger">{errors.boardId}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ประเภท Objective</label>
                <select value={form.objectiveType} onChange={(e) => set('objectiveType', e.target.value)} className={inputClass('objectiveType')}>
                  {OBJECTIVE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">เวลาโดยประมาณ (นาที)</label>
                <input type="number" min={1} value={form.estimatedMinutes} onChange={(e) => set('estimatedMinutes', e.target.value)} placeholder="60" className={inputClass('estimatedMinutes')} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-forest-900">คำอธิบาย (TH) <span className="text-danger">*</span></label>
                <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass('description')} resize-none`} />
                {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-forest-900">คำอธิบาย (EN)</label>
                <textarea rows={3} value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} className={`${inputClass('descriptionEn')} resize-none`} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รางวัล</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อ Badge</label>
                <input type="text" value={form.badgeName} onChange={(e) => set('badgeName', e.target.value)} placeholder="นักพิชิต" className={inputClass('badgeName')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อ Pin (ถ้ามี)</label>
                <input type="text" value={form.pinName} onChange={(e) => set('pinName', e.target.value)} placeholder="Pin ดอยอินทนนท์" className={inputClass('pinName')} />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">การเผยแพร่</h2>
            <div className="flex items-center gap-2">
              <input
                id="quest-status"
                type="checkbox"
                checked={form.status === 'active'}
                onChange={(e) => set('status', e.target.checked ? 'active' : 'draft')}
                className="h-4 w-4 rounded border-forest-800/30 accent-forest-800"
              />
              <label htmlFor="quest-status" className="text-xs font-medium text-ink">เผยแพร่ (Active)</label>
            </div>
          </section>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'กำลังบันทึก…' : 'บันทึก'}
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
