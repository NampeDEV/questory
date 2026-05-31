// DM-PRODUCT (SPEC-06, SPEC-10)
export type ProductCategory = 'board' | 'pin_set' | 'gift_pack' | 'sticker' | 'passport';

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceThb: number;
  imageUrls: string[];
  includes: string[];
  stock: number;
  isLimited: boolean;
  boardTemplateId: string | null;
};

// FE-STATE (SPEC-08)
export type OrderStatus =
  | 'draft'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
