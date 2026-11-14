export default function Loading() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="h-[500px] animate-pulse rounded-xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
