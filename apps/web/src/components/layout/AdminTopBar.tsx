// ADMIN-002 (TASK_ADMIN) — admin top bar
// Server component — no client state needed
import { Bell, Search, ChevronDown } from 'lucide-react';

const MOCK_ADMIN = {
  name: 'Admin Questory',
  role: 'Super Admin',
  avatarInitial: 'A',
  notificationCount: 12,
  dateRange: '24 พ.ค. 2567 – 30 พ.ค. 2567',
};

export function AdminTopBar() {
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-forest-800/10 bg-white px-4 lg:px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          placeholder="ค้นหา เมนู, ผู้ใช้, ออเดอร์, เควส..."
          className="w-full rounded-lg border border-forest-800/15 bg-sand-100 py-1.5 pl-9 pr-16 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-forest-700/30"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-forest-800/20 bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted">
          ⌘K
        </kbd>
      </div>

      {/* Date range */}
      <button
        type="button"
        className="hidden items-center gap-2 rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-sand-100 sm:flex"
      >
        <span className="text-muted">📅</span>
        <span>{MOCK_ADMIN.dateRange}</span>
        <ChevronDown size={12} className="text-muted" />
      </button>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          type="button"
          aria-label={`การแจ้งเตือน ${MOCK_ADMIN.notificationCount} รายการ`}
          className="relative rounded-lg p-1.5 text-muted hover:bg-sand-100 hover:text-ink"
        >
          <Bell size={18} />
          {MOCK_ADMIN.notificationCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-forest-950">
              {MOCK_ADMIN.notificationCount}
            </span>
          )}
        </button>

        {/* Admin avatar */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700 text-sm font-bold text-white">
            {MOCK_ADMIN.avatarInitial}
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold text-ink leading-tight">{MOCK_ADMIN.name}</span>
            <span className="text-[10px] text-muted leading-tight">{MOCK_ADMIN.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
