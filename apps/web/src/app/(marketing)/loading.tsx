// Skeleton loading state for marketing homepage
export default function HomeLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-parchment">
      {/* Hero skeleton */}
      <div className="h-[560px] bg-forest-800/20 lg:h-[640px]" />

      {/* Boards section skeleton */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="mb-8 h-8 w-48 rounded bg-forest-800/10" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-[4/3] bg-forest-800/10" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 rounded bg-forest-800/10" />
                <div className="h-4 w-full rounded bg-forest-800/10" />
                <div className="h-4 w-2/3 rounded bg-forest-800/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
