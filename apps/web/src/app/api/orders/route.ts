import { z } from 'zod';
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiError, handleRouteError, ApiError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getProducts } from '@/lib/api/products';
import { sendOrderConfirmation } from '@/lib/email/send';

// Order item from request body
const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity:  z.number().int().min(1).max(20),
});

const CreateOrderSchema = z.object({
  items:           z.array(OrderItemSchema).min(1, 'ต้องมีสินค้าอย่างน้อย 1 ชิ้น'),
  shippingName:    z.string().min(1).max(100),
  shippingAddress: z.string().min(1).max(500),
  couponCode:      z.string().max(64).optional(),
});

// API-018 (SPEC-07) — POST /api/orders
// Validates stock, applies coupon (POC: no real coupon table), creates order.
// M4: insert to DB, generate activation_codes for board products.

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = CreateOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const allProducts = await getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Validate each item and compute total
    let totalThb = 0;
    const orderItems = [];

    for (const item of parsed.data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return apiError('NOT_FOUND', `Product '${item.productId}' not found.`, 404);
      }
      if (product.stock < item.quantity) {
        return apiError('CONFLICT', `สินค้า '${product.name}' มีไม่เพียงพอ`, 409);
      }

      const lineTotal = product.priceThb * item.quantity;
      totalThb += lineTotal;
      orderItems.push({
        id:        `oi-${Date.now()}-${item.productId}`,
        productId: item.productId,
        quantity:  item.quantity,
        priceThb:  product.priceThb,
      });
    }

    // POC: coupon — hard-coded 10% discount code for testing
    if (parsed.data.couponCode) {
      const validCoupons: Record<string, number> = { 'DEMO10': 0.10 };
      const discount = validCoupons[parsed.data.couponCode.toUpperCase()];
      if (!discount) {
        throw new ApiError('INVALID_INPUT', 422, 'Coupon code ไม่ถูกต้อง');
      }
      totalThb = Math.round(totalThb * (1 - discount));
    }

    const order = {
      id:              `ord-${Date.now()}`,
      userId:          user.id,
      status:          'paid' as const,
      items:           orderItems,
      totalThb,
      shippingName:    parsed.data.shippingName,
      shippingAddress: parsed.data.shippingAddress,
      trackingNumber:  null,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    };

    // Persist to Supabase if configured (M4: wire orders + activation_codes)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const generatedCodes: string[] = [];

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(supabaseUrl, supabaseKey);

      // Insert order
      const { error: orderErr } = await db.from('orders').insert({
        id: order.id,
        user_id: user.id,
        status: order.status,
        total_thb: order.totalThb,
        shipping_name: order.shippingName,
        shipping_address: order.shippingAddress,
        coupon_code: parsed.data.couponCode ?? null,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      });
      if (orderErr) console.error('[orders] insert failed', { orderId: order.id });

      // Insert order items
      for (const item of orderItems) {
        await db.from('order_items').insert({
          id: item.id,
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price_thb: item.priceThb,
        });
      }

      // Generate activation_codes for board products (identified by boardTemplateId)
      for (const item of orderItems) {
        const product = productMap.get(item.productId);
        if (product && product.boardTemplateId) {
          for (let i = 0; i < item.quantity; i++) {
            const code = crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase();
            generatedCodes.push(code);
            await db.from('activation_codes').insert({
              id: crypto.randomUUID(),
              code,
              board_template_id: product.boardTemplateId,
              order_id: order.id,
              created_at: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Send order confirmation email (S-032) — non-blocking, never fails the order
    const userEmail = user.email;
    if (userEmail) {
      const emailItems = orderItems.map((oi) => {
        const product = productMap.get(oi.productId);
        return {
          name: product?.name ?? oi.productId,
          quantity: oi.quantity,
          priceThb: oi.priceThb * oi.quantity,
        };
      });

      void sendOrderConfirmation(userEmail, {
        orderId: order.id,
        customerName: order.shippingName,
        items: emailItems,
        totalThb: order.totalThb,
        activationCodes: generatedCodes,
        shippingAddress: order.shippingAddress,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://questory.app',
      });
    }

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
