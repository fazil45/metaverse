import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SpaceSkeleton() {
  return (
    <SkeletonTheme baseColor="#262626" highlightColor="#404040" duration={1.2}>
      <article className="overflow-hidden rounded-md border-2 border-border bg-card shadow-3xl/30 shadow-neutral-700">
        {/* Space Image */}
        <div className="h-48 w-full">
          <Skeleton width="100%" height="100%" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* Name + Arrow */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton width={140} height={20} />

              <Skeleton width={110} height={10} />
            </div>

            {/* Arrow button */}
            <Skeleton width={36} height={36} borderRadius={8} />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Skeleton height={40} borderRadius={8} />
            <Skeleton height={40} borderRadius={8} />
          </div>
        </div>
      </article>
    </SkeletonTheme>
  );
}
