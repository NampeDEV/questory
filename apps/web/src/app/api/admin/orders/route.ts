import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import type { OrderStatus } from '@/types/order';

// Mock orders (POC fallback — M4: query from DB when Supabase env is set)
const MOCK_ORDERS = [
  { id: 'ord-001', userId: 'usr-001', status: 'paid'       as OrderStatus, totalThb: 990,  shippingName: 'ณัฐวุฒิ แสงทอง',   trackingNumber: null,            createdAt: '2026-05-28T10:00:00Z' },
  { id: 'ord-002', userId: 'usr-002', status: 'shipped'    as OrderStatus, totalThb: 1490, shippingName: 'ศิริพร อันทรดี',   trackingNumber: 'TH123456789',   createdAt: '2026-05-27T09:00:00Z' },
  { id: 'ord-003', userId: 'usr-003', status: 'delivered'  as OrderStatus, totalThb: 2990, shippingName: 'Akira Tanaka',    trackingNumber: 'TH987654321',   createdAt: '2026-05-26T08:00:00Z' },
  { id: 'ord-004', userId: 'usr-004', status: 'processing' as OrderStatus, totalThb: 990,  shippingName: 'พรทิพย์ รักไทย', trackingNumber: null,            createdAt: '2026-05-25T07:00:00Z' },
];

const PatchOrderSchema = z.object({
  id:             z.string().min(1),
  status:         z.enum(['paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const),
  trackingNumber: z.string().max(100).optional(),
});

// API-ADM-003 (SPEC-07) — GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    const { searchParams } = req.nextUrl;
    const statusFilter = searchParams.get('status');
    const page         = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const PAGE_SIZE    = 20;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, count } = await query;
      return NextResponse.json({ data: data ?? [], meta: { total: count ?? 0, page, pageSize: PAGE_SIZE } });
    }

    // Fallback: mock data
    let orders = [...MOCK_ORDERS];
    if (statusFilter) {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    const total = orders.length;
    const slice = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({ data: slice, meta: { total, page, pageSize: PAGE_SIZE } });
  } catch (err) {
    return handleRouteError(err);
  }
}

// API-ADM-003 (SPEC-07) — PATCH /api/admin/orders
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = PatchOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const { error } = await supabase
        .from('orders')
        .update({
          status:          parsed.data.status,
          tracking_number: parsed.data.trackingNumber ?? null,
          updated_at:      new Date().toISOString(),
        })
        .eq('id', parsed.data.id);

      if (error) {
        return apiError('NOT_FOUND', `Order '${parsed.data.id}' not found or update failed.`, 404);
      }

      return apiSuccess({ id: parsed.data.id, status: parsed.data.status });
    }

    // Fallback: mock
    const order = MOCK_ORDERS.find((o) => o.id === parsed.data.id);
    if (!order) {
      return apiError('NOT_FOUND', `Order '${parsed.data.id}' not found.`, 404);
    }

    const updated = {
      ...order,
      status:         parsed.data.status,
      trackingNumber: parsed.data.trackingNumber ?? order.trackingNumber,
    };

    return apiSuccess(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
