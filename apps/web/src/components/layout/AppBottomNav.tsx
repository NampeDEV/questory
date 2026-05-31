'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Compass, Pin, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// FE-NAV App bottom nav (SPEC-08)
const items = [
  { label: 'หน้าหลัก', href: '/app', icon: Home },
  { label: 'บอร์ด', href: '/app/boards', icon: LayoutGrid },
  { label: 'ภารกิจ', href: '/app/missions', icon: Compass },
  { label: 'Pin', href: '/app/pins', icon: Pin },
  { label: 'โปรไฟล์', href: '/app/profile', icon: User },
];

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-forest-800/10 bg-parchment/95 backdrop-blur-sm"
      aria-label="App navigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/app' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-gold-500' : 'text-muted hover:text-ink',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={20}
                aria-hidden="true"
                className={cn(isActive && 'stroke-[2.5]')}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
