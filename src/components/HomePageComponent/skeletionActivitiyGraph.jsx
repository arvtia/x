const SkeletonActivityGraph = () => {
  const weeks = Array.from({ length: 52 }); // ~1 year of weeks
  const days = Array.from({ length: 7 });   // 7 days per week

  return (
    <div className="space-y-3 bg-white p-4">
      {/* Month labels skeleton */}
      <div className="ml-8 flex gap-1 text-xs text-neutral-300">
        <div className="w-6 shrink-0" />
        {weeks.map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-neutral-200 rounded-sm animate-pulse"
          />
        ))}
      </div>

      <div className="flex">
        {/* Weekday labels skeleton */}
        <div className="mr-2 flex w-6 flex-col justify-between py-1 text-xs text-neutral-300">
          <span className="h-3 w-6 bg-neutral-200 rounded animate-pulse" />
          <span className="h-3 w-6 bg-neutral-200 rounded animate-pulse" />
          <span className="h-3 w-6 bg-neutral-200 rounded animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((_, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {days.map((_, di) => (
                <div
                  key={`${wi}-${di}`}
                  className="h-3 w-3 rounded-sm bg-neutral-200 animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonActivityGraph;