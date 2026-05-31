'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { navLinks } from '@/config/site';

// FE-NAV marketing header — dark theme (SPEC-08)
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-forest-900 shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white" aria-label="Questory home">
          <svg viewBox="0 0 32 32" className="h-7 w-7 flex-shrink-0" fill="currentColor" aria-hidden="true">
            <polygon points="16,2 30,28 2,28" />
          </svg>
          <div className="leading-[1.15]">
            <p className="text-[10px] font-black tracking-[0.2em] text-white">QUEST</p>
            <p className="text-[10px] font-black tracking-[0.2em] text-white">ORY</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-5 text-sm font-medium transition-colors border-b-2',
                  isActive
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-white/70 hover:text-white',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right — icons + buttons */}
        <div className="hidden items-center gap-1 md:flex">
          <button
            className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:text-white"
            aria-label="ค้นหา"
          >
            <Search size={17} />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:text-white"
            aria-label="เลือกภาษา"
          >
            <Globe size={17} />
          </button>
          <Link href="/auth/sign-in" className="ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="border border-white/25 text-white hover:bg-white/10 hover:text-white"
            >
              Login
            </Button>
          </Link>
          <Link href="/activate">
            <Button variant="gold" size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t border-white/10 bg-forest-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 border border-white/25 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/auth/sign-in">Login</Link>
            </Button>
            <Button variant="gold" size="sm" className="flex-1" asChild>
              <Link href="/activate">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
