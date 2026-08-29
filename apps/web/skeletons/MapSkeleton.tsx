import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MapSkeleton() {
  return (
    <SkeletonTheme baseColor="#262626" highlightColor="#404040" duration={1.2}>
      <div className="flex flex-col overflow-hidden rounded-lg border-2 border-border bg-background md:flex-row">
        {/* Image */}
        <div className="h-48 w-full md:h-56 md:w-[45%]">
          <Skeleton width="100%" height="100%" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-6 p-5">
          <div className="space-y-3">
            <Skeleton width={64} height={12} />

            <Skeleton width={192} height={28} />

            <div className="space-y-2">
              <Skeleton width="100%" height={12} />

              <Skeleton width="80%" height={12} />
            </div>
          </div>

          <Skeleton width="100%" height={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
