'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ShoppingBag, QrCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/utils/analytics';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// FE-PAGE-CHECKOUT (SPEC-08, S-030)
// Authenticated users: full payment flow via /api/orders + /api/payment/create-charge
// Unauthenticated users: interest-capture form (no payment)
export const dynamic = 'force-dynamic';

/** Maps the simple product selector values to real product IDs from mock/DB */
const PRODUCT_ID_MAP: Record<string, string> = {
  starter:  'prod-001',
  regional: 'prod-002',
  ultimate: 'prod-003',
  gift:     'prod-004',
};

const productOptions = [
  { value: 'starter',  label: 'Starter Quest Pack — ฿990' },
  { value: 'regional', label: 'Regional Board — ฿1,490' },
  { value: 'ultimate', label: 'Ultimate 156 Parks — ฿2,990' },
  { value: 'gift',     label: 'Gift Box Set — ฿1,290' },
];

const provinces = [
  'กรุงเทพมหานคร','เชียงใหม่','ขอนแก่น','นครราชสีมา','สงขลา','ภูเก็ต','ชลบุรี','เชียงราย',
  'อุดรธานี','สุราษฎร์ธานี','อื่นๆ',
];

type CheckoutStep = 'form' | 'payment' | 'success';

type PaymentData = {
  chargeId: string;
  qrCodeUrl?: string;
  expiresAt?: string;
  orderId: string;
};

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', province: '',
    product: '', quantity: '1', comment: '',
  });
  const [step, setStep] = useState<CheckoutStep>('form');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch((err: unknown) => {
        // Auth check failed — treat user as unauthenticated
        console.error('[checkout] auth check failed:', err);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim())          errs['name'] = 'กรุณากรอกชื่อ';
    if (!form.email.includes('@'))  errs['email'] = 'อีเมลไม่ถูกต้อง';
    if (!form.phone.trim())         errs['phone'] = 'กรุณากรอกเบอร์โทร';
    if (!form.province)             errs['province'] = 'กรุณาเลือกจังหวัด';
    if (!form.product)              errs['product'] = 'กรุณาเลือกสินค้า';
    return errs;
  }

  async function handleInterestSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStep('success');
    analytics.addToCart(form.product, parseInt(form.quantity, 10));
  }

  async function handleAuthenticatedCheckout(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setSubmitting(true);

    try {
      const productId = PRODUCT_ID_MAP[form.product];
      if (!productId) {
        setErrors({ product: 'สินค้าไม่ถูกต้อง' });
        return;
      }

      // Step 1: Create order
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: [{ productId, quantity: parseInt(form.quantity, 10) }],
          shippingName: form.name,
          shippingAddress: `${form.phone}, ${form.province}`,
        }),
      });

      if (!orderRes.ok) {
        const body = (await orderRes.json()) as { message?: string };
        setApiError(body.message ?? 'ไม่สามารถสร้างออร์เดอร์ได้');
        return;
      }

      const { data: order } = (await orderRes.json()) as { data: { id: string } };

      // Step 2: Create PromptPay charge
      // In production, Omise.js tokenises payment client-side; here we use a mock source token.
      const chargeRes = await fetch('/api/payment/create-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          method: 'promptpay',
          sourceToken: 'src_mock_promptpay',  // Replace with real Omise.js token in production
          orderId: order.id,
        }),
      });

      if (!chargeRes.ok) {
        setApiError('ไม่สามารถสร้างคำสั่งชำระเงินได้ กรุณาลองใหม่');
        return;
      }

      type ChargeData = { chargeId: string; qrCodeUrl?: string; expiresAt?: string };
      const { data: charge } = (await chargeRes.json()) as { data: ChargeData };

      setPaymentData({ ...charge, orderId: order.id });
      setStep('payment');
      analytics.addToCart(form.product, parseInt(form.quantity, 10));
    } catch {
      setApiError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePollPayment() {
    if (!paymentData) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/payment/charge-status?chargeId=${encodeURIComponent(paymentData.chargeId)}&orderId=${encodeURIComponent(paymentData.orderId)}`,
      );
      if (!res.ok) { setApiError('ไม่สามารถตรวจสอบสถานะได้'); return; }

      const { data } = (await res.json()) as { data: { status: string } };
      if (data.status === 'successful') setStep('success');
      else setApiError('ยังไม่ได้รับการชำระเงิน กรุณาสแกน QR และลองอีกครั้ง');
    } catch {
      setApiError('เกิดข้อผิดพลาดในการตรวจสอบ');
    } finally {
      setSubmitting(false);
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Loading auth state
  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-parchment">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-parchment px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle size={32} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-forest-900">
            {user ? 'ชำระเงินสำเร็จ!' : 'ขอบคุณ!'}
          </h1>
          <p className="mt-2 text-muted">
            {user
              ? 'ออร์เดอร์ของคุณได้รับการยืนยัน เราจะส่ง Activation Code ไปยังอีเมลของคุณ'
              : 'เราได้รับข้อมูลของคุณแล้ว ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ'}
          </p>
          {user && (
            <Link
              href="/activate"
              className="mt-6 inline-flex h-[48px] items-center rounded-lg bg-gold-500 px-6 font-semibold text-forest-900 hover:bg-gold-400"
            >
              เปิดใช้งาน Board →
            </Link>
          )}
          <Link
            href="/"
            className="mt-3 inline-flex h-[48px] items-center rounded-lg border border-forest-800/20 px-6 font-semibold text-forest-800 hover:bg-forest-100"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  // PromptPay QR payment step
  if (step === 'payment' && paymentData) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-parchment px-4">
        <div className="w-full max-w-md rounded-2xl border border-forest-800/10 bg-white/80 p-8 shadow-card text-center">
          <QrCode className="mx-auto h-8 w-8 text-forest-700" />
          <h2 className="mt-3 font-display text-xl font-bold text-forest-900">ชำระผ่าน PromptPay</h2>
          <p className="mt-2 text-sm text-muted">สแกน QR Code ด้วยแอปธนาคารเพื่อชำระเงิน</p>

          <div className="my-6 flex justify-center">
            {paymentData.qrCodeUrl ? (
              <Image
                src={paymentData.qrCodeUrl}
                alt="PromptPay QR Code"
                width={240}
                height={240}
                className="rounded-xl border border-forest-800/10"
              />
            ) : (
              <div className="flex h-60 w-60 items-center justify-center rounded-xl bg-forest-50 text-forest-400 text-sm">
                QR Code จะแสดงเมื่อเชื่อมต่อ Omise
              </div>
            )}
          </div>

          {paymentData.expiresAt && (
            <p className="mb-4 text-xs text-muted">
              QR หมดอายุ: {new Date(paymentData.expiresAt).toLocaleTimeString('th-TH')}
            </p>
          )}

          {apiError && <p className="mb-4 text-sm text-danger">{apiError}</p>}

          <Button
            variant="gold"
            className="w-full"
            onClick={() => void handlePollPayment()}
            isLoading={submitting}
          >
            ฉันชำระเงินแล้ว — ตรวจสอบสถานะ
          </Button>
          <button
            type="button"
            onClick={() => setStep('form')}
            className="mt-3 text-sm text-muted hover:text-ink"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      <div className="border-b border-forest-800/10 bg-forest-900 py-10 text-center">
        <ShoppingBag className="mx-auto h-8 w-8 text-gold-500" aria-hidden="true" />
        <h1 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
          Pre-order / สั่งซื้อ
        </h1>
        <p className="mt-1 text-sand-200/70">กรอกข้อมูลเพื่อรับการติดต่อจากทีมงาน</p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <form
          onSubmit={user ? handleAuthenticatedCheckout : handleInterestSubmit}
          noValidate
          className="rounded-2xl border border-forest-800/10 bg-white/80 p-6 shadow-card space-y-5"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-forest-900">
              ชื่อ–นามสกุล <span className="text-danger">*</span>
            </label>
            <input
              id="name" type="text" value={form.name} onChange={set('name')} required
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-forest-900">
              อีเมล <span className="text-danger">*</span>
            </label>
            <input
              id="email" type="email" value={form.email} onChange={set('email')} required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-forest-900">
              เบอร์โทรศัพท์ <span className="text-danger">*</span>
            </label>
            <input
              id="phone" type="tel" value={form.phone} onChange={set('phone')} required
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
            {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
          </div>

          {/* Province */}
          <div>
            <label htmlFor="province" className="block text-sm font-semibold text-forest-900">
              จังหวัด <span className="text-danger">*</span>
            </label>
            <select
              id="province" value={form.province} onChange={set('province')} required
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            >
              <option value="">-- เลือกจังหวัด --</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.province && <p className="mt-1 text-xs text-danger">{errors.province}</p>}
          </div>

          {/* Product */}
          <div>
            <label htmlFor="product" className="block text-sm font-semibold text-forest-900">
              สินค้าที่สนใจ <span className="text-danger">*</span>
            </label>
            <select
              id="product" value={form.product} onChange={set('product')} required
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            >
              <option value="">-- เลือกสินค้า --</option>
              {productOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.product && <p className="mt-1 text-xs text-danger">{errors.product}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-forest-900">
              จำนวน
            </label>
            <input
              id="quantity" type="number" min="1" max="10" value={form.quantity} onChange={set('quantity')}
              className="mt-2 w-24 rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-forest-900">
              ข้อความเพิ่มเติม
            </label>
            <textarea
              id="comment" value={form.comment} onChange={set('comment')} rows={3}
              className="mt-2 w-full rounded-lg border border-forest-700/30 bg-parchment px-4 py-3 text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
              placeholder="ระบุความต้องการพิเศษหรือข้อความถึงทีมงาน"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            isLoading={submitting}
          >
            {user ? 'ดำเนินการชำระเงิน →' : 'ส่งข้อมูล'}
          </Button>

          {apiError && <p className="text-center text-sm text-danger">{apiError}</p>}

          <p className="text-center text-xs text-muted">
            {user
              ? 'หลังจากนี้คุณจะได้รับ QR Code สำหรับชำระผ่าน PromptPay'
              : 'ข้อมูลของคุณจะถูกใช้เพื่อการติดต่อเท่านั้น ไม่มีการชำระเงินในขั้นตอนนี้'}
          </p>
        </form>
      </div>
    </div>
  );
}
