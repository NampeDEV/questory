// FE-STATE (SPEC-08)
export type OrderStatus =
  | 'draft'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalThb: number;
  shippingName: string;
  shippingAddress: string;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceThb: number;
};
