import Link from 'next/link';
import { siteConfig, navLinks } from '@/config/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest-800/10 bg-forest-950 text-sand-100">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <span className="text-gold-500">⬡</span>
              <span>Questory</span>
            </Link>
            <p className="mt-3 text-sm text-sand-200/70 leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200/50">
              Product
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand-200/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200/50">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-sand-200/70">
              <li>
                <Link href="/activate" className="hover:text-white transition-colors">
                  Activate Board
                </Link>
              </li>
              <li>
                <a href="mailto:hello@questory.app" className="hover:text-white transition-colors">
                  ติดต่อเรา
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sand-200/50">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-sand-200/70">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-sand-200/40">
          © {year} Questory. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
