import { AppBottomNav } from '@/components/layout/AppBottomNav';

// Authenticated app route group layout (SPEC-08)
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-parchment">
      <main className="pb-20">{children}</main>
      <AppBottomNav />
    </div>
  );
}
