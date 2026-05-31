// Skeleton loading state for board detail page
export default function BoardDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-parchment">
      {/* Hero skeleton */}
      <div className="h-[360px] bg-forest-800/20 lg:h-[480px]" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tabs skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-24 rounded-full bg-forest-800/10" />
              ))}
            </div>
            <div className="rounded-2xl bg-forest-800/10 p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 rounded bg-forest-800/10" style={{ width: `${90 - i * 8}%` }} />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-forest-800/10 p-5 space-y-3">
              <div className="h-6 w-24 rounded bg-forest-800/10" />
              <div className="h-10 rounded bg-forest-800/10" />
              <div className="h-10 rounded bg-forest-800/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
