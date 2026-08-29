import Skeleton from "react-loading-skeleton";

export default function MapSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-border bg-background md:flex-row">
      <Skeleton className="h-48 w-full md:h-56 md:w-[45%]" />

      <div className="flex flex-1 flex-col justify-between gap-6 p-5">
        <div className="space-y-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-40" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
