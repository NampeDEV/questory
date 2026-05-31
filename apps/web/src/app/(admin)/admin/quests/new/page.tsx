'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Eye, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-041b (TASK_ADMIN) — Create new Quest form

const MOCK_BOARDS = [
  { id: 'board-001', name: 'บอร์ดดอยอินทนนท์' },
  { id: 'board-002', name: 'บอร์ดเขาใหญ่ Explorer' },
  { id: 'board-003', name: 'บอร์ดสิมิลัน Diver' },
  { id: 'board-004', name: 'บอร์ดภูกระดึง' },
];

const OBJECTIVE_TYPES = [
  { value: 'photo',   label: 'ถ่ายรูปสถานที่' },
  { value: 'checkin', label: 'Check-in จุดหมาย' },
  { value: 'quiz',    label: 'ตอบคำถาม' },
  { value: 'hike',    label: 'เดินทางระยะทาง' },
];

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

const INITIAL: FormState = {
  name: '',
  nameEn: '',
  boardId: '',
  objectiveType: 'photo',
  description: '',
  descriptionEn: '',
  badgeName: '',
  pinName: '',
  estimatedMinutes: '',
  status: 'draft',
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อเควส';
  if (!form.boardId) errors.boardId = 'กรุณาเลือกบอร์ด';
  if (!form.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
  return errors;
}

export default function NewQuestPage() {
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
    // Mock save — replace with POST /api/admin/quests when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    if (publishNow) {
      set('status', 'active');
    }
    setTimeout(() => router.push('/admin/quests'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/quests" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          เควส
        </Link>
        <span>/</span>
        <span className="text-ink">สร้างเควสใหม่</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">สร้างเควสใหม่</h1>
          <p className="mt-1 text-sm text-muted">กำหนดภารกิจ เป้าหมาย และรางวัลสำหรับผู้เล่น</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่รายการเควส…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลเควส</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่อเควส (TH) <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="เช่น พิชิตยอดดอย"
                  className={inputClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อเควส (EN)</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => set('nameEn', e.target.value)}
                  placeholder="e.g. Summit Challenge"
                  className={inputClass('nameEn')}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">
                  บอร์ด <span className="text-danger">*</span>
                </label>
                <select
                  value={form.boardId}
                  onChange={(e) => set('boardId', e.target.value)}
                  className={inputClass('boardId')}
                >
                  <option value="">— เลือกบอร์ด —</option>
                  {MOCK_BOARDS.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.boardId && <p className="mt-1 text-xs text-danger">{errors.boardId}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">ประเภทภารกิจ</label>
                <select
                  value={form.objectiveType}
                  onChange={(e) => set('objectiveType', e.target.value)}
                  className={inputClass('objectiveType')}
                >
                  {OBJECTIVE_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รายละเอียดภารกิจ</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  คำอธิบาย (TH) <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="อธิบายเป้าหมายของภารกิจนี้…"
                  className={inputClass('description')}
                />
                {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">คำอธิบาย (EN)</label>
                <textarea
                  rows={3}
                  value={form.descriptionEn}
                  onChange={(e) => set('descriptionEn', e.target.value)}
                  placeholder="Describe the quest objective…"
                  className={inputClass('descriptionEn')}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">
                  เวลาโดยประมาณ (นาที)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.estimatedMinutes}
                  onChange={(e) => set('estimatedMinutes', e.target.value)}
                  placeholder="60"
                  className={inputClass('estimatedMinutes')}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right — rewards + actions */}
        <div className="space-y-5">
          {/* Rewards */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รางวัล</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อ Badge</label>
                <input
                  type="text"
                  value={form.badgeName}
                  onChange={(e) => set('badgeName', e.target.value)}
                  placeholder="เช่น Doi Inthanon Conqueror"
                  className={inputClass('badgeName')}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อ Pin</label>
                <input
                  type="text"
                  value={form.pinName}
                  onChange={(e) => set('pinName', e.target.value)}
                  placeholder="เช่น Summit Pin"
                  className={inputClass('pinName')}
                />
              </div>
            </div>
          </section>

          {/* Status toggle */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">สถานะ</h2>
            <div className="flex gap-2">
              {(['draft', 'active'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    form.status === s
                      ? 'border-forest-700 bg-forest-700 text-white'
                      : 'border-forest-800/20 text-muted hover:bg-sand-100'
                  }`}
                >
                  {s === 'draft' ? 'Draft' : 'Active'}
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving || saved}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              บันทึก Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving || saved}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500 px-4 py-2.5 text-sm font-semibold text-gold-700 hover:bg-gold-50 disabled:opacity-50"
            >
              <Eye size={15} />
              บันทึก &amp; Publish
            </button>
            <Link
              href="/admin/quests"
              className="block text-center text-xs text-muted hover:text-ink"
            >
              ยกเลิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
