'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// ADMIN-031b — Edit Product page

const CATEGORY_OPTIONS = [
  { value: 'Pin',     label: 'Pin' },
  { value: 'Board',   label: 'Board' },
  { value: 'Bundle',  label: 'Bundle' },
  { value: 'Badge',   label: 'Badge' },
  { value: 'Sticker', label: 'Sticker' },
];

// Mock lookup — replace with GET /api/admin/products/:id when Supabase is wired
const MOCK_PRODUCT_BY_ID: Record<string, {
  name: string; nameEn: string; category: string; price: string;
  stock: string; description: string; sku: string;
  status: 'active' | 'draft' | 'out_of_stock' | 'low_stock';
}> = {
  'PRD-001': { name: 'Pin ลายดอยอินทนนท์', nameEn: 'Doi Inthanon Pin', category: 'Pin', price: '290', stock: '18', description: 'Pin เคลือบสีสวยงาม ลายดอยอินทนนท์', sku: 'PIN-DOI-001', status: 'low_stock' },
  'PRD-002': { name: 'Pin ลายเขาใหญ่', nameEn: 'Khao Yai Pin', category: 'Pin', price: '290', stock: '22', description: 'Pin ลายเขาใหญ่มรดกโลก', sku: 'PIN-KHY-001', status: 'low_stock' },
  'PRD-003': { name: 'Board ดอยอินทนนท์', nameEn: 'Doi Inthanon Board', category: 'Board', price: '1290', stock: '85', description: 'Board ภารกิจสำหรับดอยอินทนนท์', sku: 'BRD-DOI-001', status: 'active' },
  'PRD-004': { name: 'Pin Set อุทยาน 5 ภาค', nameEn: 'National Park 5-Region Pin Set', category: 'Bundle', price: '1290', stock: '15', description: 'Set Pin ครบ 5 ภาค', sku: 'SET-5REG-001', status: 'low_stock' },
  'PRD-007': { name: 'Pin ลายทะเล Set', nameEn: 'Marine Pin Set', category: 'Pin', price: '590', stock: '0', description: 'Pin Set ลายทะเล', sku: 'PIN-SEA-001', status: 'out_of_stock' },
};

type FormState = {
  name: string; nameEn: string; category: string; price: string;
  stock: string; description: string; sku: string;
  status: 'active' | 'draft' | 'out_of_stock' | 'low_stock';
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อสินค้า';
  if (!form.price || Number(form.price) <= 0) errors.price = 'ราคาต้องมากกว่า 0';
  if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'จำนวนสต็อกต้องไม่ติดลบ';
  if (!form.sku.trim()) errors.sku = 'กรุณากรอก SKU';
  return errors;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params['id'] === 'string' ? params['id'] : '';

  const seed = MOCK_PRODUCT_BY_ID[id] ?? {
    name: '', nameEn: '', category: 'Pin', price: '', stock: '',
    description: '', sku: '', status: 'draft' as const,
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
    // Mock save — replace with PATCH /api/admin/products/:id when Supabase is wired
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/products'), 1200);
  }

  const inputClass = (field: keyof FormState) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
      errors[field] ? 'border-danger' : 'border-forest-800/20'
    }`;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/products" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          สินค้า
        </Link>
        <span>/</span>
        <span className="text-ink">แก้ไขสินค้า</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">แก้ไขสินค้า</h1>
          <p className="mt-1 text-sm text-muted">{id ? `ID: ${id}` : 'ไม่พบสินค้านี้'}</p>
        </div>
        <AdminStatusBadge status={form.status} />
      </div>

      {saved && (
        <div className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ บันทึกสำเร็จ กำลังกลับสู่รายการสินค้า…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลสินค้า</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ชื่อสินค้า (TH) <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="Pin ลายดอยอินทนนท์" className={inputClass('name')} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">ชื่อสินค้า (EN)</label>
                <input type="text" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)}
                  placeholder="Doi Inthanon Pin" className={inputClass('nameEn')} />
              </div>
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
                <label className="block text-xs font-medium text-forest-900">
                  SKU <span className="text-danger">*</span>
                </label>
                <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)}
                  placeholder="PIN-DOI-001" className={inputClass('sku')} />
                {errors.sku && <p className="mt-1 text-xs text-danger">{errors.sku}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">คำอธิบาย</h2>
            <textarea rows={3} value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="อธิบายรายละเอียดสินค้า"
              className={inputClass('description')} />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ราคาและสต็อก</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  ราคา (THB) <span className="text-danger">*</span>
                </label>
                <input type="number" min="1" value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="290" className={inputClass('price')} />
                {errors.price && <p className="mt-1 text-xs text-danger">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-forest-900">
                  จำนวนสต็อก <span className="text-danger">*</span>
                </label>
                <input type="number" min="0" value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="50" className={inputClass('stock')} />
                {errors.stock && <p className="mt-1 text-xs text-danger">{errors.stock}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">สถานะสินค้า</h2>
            <select value={form.status}
              onChange={(e) => set('status', e.target.value as FormState['status'])}
              className={inputClass('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
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
