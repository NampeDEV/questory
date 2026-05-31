// ADMIN-003 (TASK_ADMIN) — full admin layout with sidebar + topbar
// Security: real role check must happen in middleware (server-side session).
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopBar } from '@/components/layout/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-parchment">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right column: topbar + content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
