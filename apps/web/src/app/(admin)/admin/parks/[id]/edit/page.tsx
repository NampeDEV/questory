'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, MapPin } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { nationalParks } from '@/data/parks';

const REGION_OPTIONS = [
  { value: 'rgn-01', label: 'ภาคเหนือ' },
  { value: 'rgn-02', label: 'ภาคกลาง' },
  { value: 'rgn-03', label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 'rgn-04', label: 'ภาคตะวันออก' },
  { value: 'rgn-05', label: 'ภาคใต้' },
];

type FormState = {
  parkCode: string;
  nameTh: string;
  nameEn: string;
  regionId: string;
  provinceId: string;
  description: string;
  coverImage: string;
  latitude: string;
  longitude: string;
  mapUrl: string;
  status: 'active' | 'inactive';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.parkCode.trim()) errors.parkCode = 'กรุณากรอกรหัสอุทยาน';
  else if (!/^[A-Z]{2,10}$/.test(form.parkCode)) errors.parkCode = 'รหัสต้องเป็นตัวพิมพ์ใหญ่ 2–10 ตัว';
  if (!form.nameTh.trim()) errors.nameTh = 'กรุณากรอกชื่ออุทยาน (TH)';
  if (!form.regionId) errors.regionId = 'กรุณาเลือกภาค';
  if (!form.provinceId.trim()) errors.provinceId = 'กรุณากรอกจังหวัด';
  if (form.latitude  && isNaN(parseFloat(form.latitude)))  errors.latitude  = 'ละติจูดไม่ถูกต้อง';
  if (form.longitude && isNaN(parseFloat(form.longitude))) errors.longitude = 'ลองจิจูดไม่ถูกต้อง';
  return errors;
}

export default function EditParkPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const park = nationalParks.find((p) => p.id === id);

  const initial: FormState = {
    parkCode:    park?.parkCode    ?? '',
    nameTh:      park?.nameTh      ?? '',
    nameEn:      park?.nameEn      ?? '',
    regionId:    park?.regionId    ?? '',
    provinceId:  park?.provinceId  ?? '',
    description: park?.description ?? '',
    coverImage:  park?.coverImage  ?? '',
    latitude:    park?.latitude    != null ? String(park.latitude)  : '',
    longitude:   park?.longitude   != null ? String(park.longitude) : '',
    mapUrl:      park?.mapUrl      ?? '',
    status:      park?.status      ?? 'active',
  };

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSave() {
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/parks'), 1200);
  }

  const inputCls = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/parks" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />ฐานข้อมูลอุทยาน
        </Link>
        <span>/</span>
        <span className="text-ink">แก้ไขอุทยาน</span>
      </div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไข: {park?.nameTh ?? 'อุทยาน'}</h1>
          <p className="mt-1 text-sm text-muted">{park?.parkCode}</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>
      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">บันทึกสำเร็จ กำลังกลับสู่รายการอุทยาน...</div>
      )}
      <div className="space-y-5">
        <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลพื้นฐาน</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-forest-900">รหัสอุทยาน <span className="text-danger">*</span></label>
              <input type="text" value={form.parkCode} onChange={(e) => set('parkCode', e.target.value.toUpperCase())} maxLength={10} className={inputCls('parkCode')} />
              {errors.parkCode && <p className="mt-1 text-xs text-danger">{errors.parkCode}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">สถานะ</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])} className={inputCls('status')}>
                <option value="active">เปิดบริการ</option>
                <option value="inactive">ปิดบริการ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ชื่ออุทยาน (TH) <span className="text-danger">*</span></label>
              <input type="text" value={form.nameTh} onChange={(e) => set('nameTh', e.target.value)} className={inputCls('nameTh')} />
              {errors.nameTh && <p className="mt-1 text-xs text-danger">{errors.nameTh}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ชื่ออุทยาน (EN)</label>
              <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} className={inputCls('nameEn')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ภาค <span className="text-danger">*</span></label>
              <select value={form.regionId} onChange={(e) => set('regionId', e.target.value)} className={inputCls('regionId')}>
                <option value="">เลือกภาค</option>
                {REGION_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
              {errors.regionId && <p className="mt-1 text-xs text-danger">{errors.regionId}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">จังหวัด <span className="text-danger">*</span></label>
              <input type="text" value={form.provinceId} onChange={(e) => set('provinceId', e.target.value)} className={inputCls('provinceId')} />
              {errors.provinceId && <p className="mt-1 text-xs text-danger">{errors.provinceId}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-forest-900">คำอธิบาย</label>
              <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputCls('description')} resize-none`} />
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-ink">รูปภาพและแผนที่</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-forest-900">URL รูปภาพหน้าปก</label>
              <input type="url" value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} className={inputCls('coverImage')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-forest-900">URL แผนที่ Google Maps</label>
              <input type="url" value={form.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} className={inputCls('mapUrl')} />
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
            <MapPin size={14} className="text-forest-600" />พิกัด GPS
          </h2>
          <p className="mb-4 text-xs text-muted">ใช้สำหรับแสดงแผนที่และคำนวณระยะทาง</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-forest-900">ละติจูด</label>
              <input type="number" step="0.0001" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} className={inputCls('latitude')} />
              {errors.latitude && <p className="mt-1 text-xs text-danger">{errors.latitude}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-900">ลองจิจูด</label>
              <input type="number" step="0.0001" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} className={inputCls('longitude')} />
              {errors.longitude && <p className="mt-1 text-xs text-danger">{errors.longitude}</p>}
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <Link href="/admin/parks" className="rounded-xl border border-forest-800/20 px-5 py-2.5 text-sm font-medium text-muted hover:bg-sand-100">ยกเลิก</Link>
          <button type="button" onClick={handleSave} disabled={isSaving || saved} className="flex items-center gap-2 rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  );
}