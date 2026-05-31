// Skeleton loading state for authenticated app pages
export default function AppLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-parchment">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        {/* Header skeleton */}
        <div className="mb-6 h-8 w-56 rounded bg-forest-800/10" />
        <div className="mb-8 h-4 w-80 rounded bg-forest-800/10" />

        {/* Card grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-2/3 rounded bg-forest-800/10" />
              <div className="h-4 w-full rounded bg-forest-800/10" />
              <div className="h-4 w-3/4 rounded bg-forest-800/10" />
              <div className="mt-4 h-9 rounded-lg bg-forest-800/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
