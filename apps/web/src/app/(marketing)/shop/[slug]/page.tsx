import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/api/products';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { formatThb } from '@/lib/utils/format-thb';
import { CheckCircle } from 'lucide-react';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };
  return { title: product.name, description: product.description };
}

// FE-PAGE-PRODUCT-DETAIL (SPEC-08)
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-forest-800/10">
            <Image
              src={product.imageUrls[0] ?? '/images/boards/starter-10.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isLimited && (
              <div className="absolute right-4 top-4">
                <BadgePill variant="rare">Limited Edition</BadgePill>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm font-medium text-muted uppercase tracking-wider">
              {product.sku}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-forest-900">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-bold text-forest-800">
              {formatThb(product.priceThb)}
            </p>
            <p className="mt-4 text-ink/80 leading-relaxed">{product.description}</p>

            {/* What's included */}
            <div className="mt-6">
              <h2 className="font-serif font-bold text-forest-900">สิ่งที่รวมอยู่ในกล่อง</h2>
              <ul className="mt-3 space-y-2">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckCircle size={16} className="flex-shrink-0 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock */}
            <p className="mt-4 text-sm text-muted">
              {product.stock > 0
                ? `มีสินค้า ${product.stock} ชิ้น`
                : 'สินค้าหมด'}
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="gold" size="lg" className="flex-1" disabled={product.stock === 0}>
                {product.stock > 0 ? 'เพิ่มลงรถเข็น' : 'สินค้าหมด'}
              </Button>
              {product.boardTemplateId && (
                <Button variant="secondary" size="lg" asChild>
                  <Link href={`/boards/${product.slug}`}>ดูรายละเอียดบอร์ด</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
