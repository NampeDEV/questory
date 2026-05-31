import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/api/products';
import { BadgePill } from '@/components/ui/BadgePill';
import { Button } from '@/components/ui/Button';
import { formatThb } from '@/lib/utils/format-thb';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'ซื้อบอร์ด Pin Set Gift Box และ Sticker สำหรับนักสำรวจอุทยาน',
};

// FE-PAGE-SHOP (SPEC-08)
export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="relative overflow-hidden border-b border-forest-800/10 bg-forest-900 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage:"url('/images/boards/starter-10.jpg')"}}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950/70"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Shop</h1>
          <p className="mt-2 text-sand-200/70">บอร์ด • Pin Set • Gift Box • Sticker</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group block"
              aria-label={product.name}
            >
              <div className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white/80 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-800/10">
                  <Image
                    src={product.imageUrls[0] ?? '/images/boards/starter-10.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {product.isLimited && (
                    <div className="absolute right-3 top-3">
                      <BadgePill variant="rare">Limited</BadgePill>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-forest-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-forest-800">
                      {formatThb(product.priceThb)}
                    </span>
                    <Button variant="primary" size="sm">
                      เพิ่มลงรถเข็น
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
