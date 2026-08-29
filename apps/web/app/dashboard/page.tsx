"use client";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogIn,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import SpaceSkeleton from "../../skeletons/SpaceSkeleton";
import MapTable from "../../components/MapTable";
import SpaceCard from "../../components/SpaceCard";
import { useSpaceStore } from "../../store/SpaceStore";
import { useMapStore } from "../../store/MapStore";

export default function DashboardPage() {
  const { fetchSpace, isFetchingSpace, spaces, totalPages } = useSpaceStore();
  const [showMaps, setShowMaps] = useState(false);
  const { maps, isFetchingMap } = useMapStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSpace(page);
  }, [page]);

  const addSpace = () => {
    setPage(1);
    fetchSpace(1);
  };

  return (
    <div className="relative min-h-[calc(100vh-82px)] w-full">
      {/* Header */}
      <div className=" relative z-50 mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Spaces</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your virtual spaces.
          </p>
        </div>

        <Button
          variant="primary"
          type="button"
          onClick={() => setShowMaps((prev) => !prev)}
        >
          {showMaps ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          Create space
        </Button>
      </div>

      {showMaps && (
        <>
          {/* Blurred Background */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMaps(false)}
          />
          x{/* Map Table */}
          <div className="absolute left-0 top-24 z-50 w-full">
            <MapTable setShowMaps={setShowMaps} onCreation={addSpace} />
          </div>
        </>
      )}

      <div className="mx-auto max-w-5xl px-8 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Created Spaces</h2>

            <p className="text-sm text-muted-foreground">
              Manage your existing virtual spaces.
            </p>
          </div>

          <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {spaces.length} spaces
          </span>
        </div>

        {isFetchingSpace ? (
          <div className="grid gap-6  md:grid-cols-2">
            <SpaceSkeleton />
            <SpaceSkeleton />
            <SpaceSkeleton />
            <SpaceSkeleton />
          </div>
        ) : (
          <div>
            {spaces.length > 0 ? (
              <div className="grid gap-6  md:grid-cols-2">
                {spaces.map((space) => (
                  <SpaceCard space={space} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border py-16 text-center">
                <h3 className="font-semibold">No spaces created yet</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a map above to create your first virtual space.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="my-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className=" px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className=" px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
