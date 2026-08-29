"use client";
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import MapSkeleton from "../skeletons/MapSkeleton";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { HTTP_URL } from "../utils/import";
import { toast } from "sonner";
import { errorHandler } from "../utils/errorHandler";
import { Maps } from "../types/types";
import { useModal } from "../store/ConfirmationModalStore";
import ConfirmationModal from "./ConfirmationModal";
import { useSpaceStore } from "../store/SpaceStore";
import { useMapStore } from "../store/MapStore";

export default function MapTable({
  setShowMaps,
  onCreation,
}: {
  onCreation: () => void;
  setShowMaps: (value: SetStateAction<boolean>) => void;
}) {
  const [selectedMap, setSelectedMap] = useState<Maps | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, setIsOpen } = useModal();
  const { createSpace, creatingSpace } = useSpaceStore();
  const {fetchMaps,isFetchingMap,maps} = useMapStore()


  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl px-8">
      {/* Container */}
      <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Choose a map</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a map to create a new virtual space.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMaps(false)}
            className="grid size-9 place-items-center rounded-lg border-2 border-border transition hover:bg-background"
          >
            ×
          </button>
        </div>
        <ConfirmationModal
          isOpen={isOpen}
          title="Confirm selected map"
          description={
            selectedMap ? `Create a new space using ${selectedMap.name}?` : ""
          }
          confirmText={`${creatingSpace ? "Creating.." : "Create Space"}`}
          cancelText="Cancel"
          onConfirm={() => {
            if (selectedMap) {
              createSpace(selectedMap, onCreation);
              setIsOpen();
            }
          }}
          onCancel={() => {
            setIsOpen();
            setSelectedMap(null);
          }}
        />

        {/* Maps */}
        <div className="grid gap-4 p-5">
          {loading ? (
            <div className="flex flex-col gap-2">
              <MapSkeleton />
              <MapSkeleton />
              <MapSkeleton />
            </div>
          ) : (
            <div>
              {maps.map((map) => (
                <article
                  key={map.id}
                  className="group flex flex-col overflow-hidden rounded-lg border-2 border-border bg-background transition-all hover:-translate-y-0.5 hover:shadow-lg md:flex-row"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted md:h-auto md:w-[45%]">
                    <img
                      src={map.thumbnail}
                      alt={map.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {map.width} × {map.height}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between gap-6 p-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Map
                      </p>

                      <h3 className="mt-1 text-xl font-semibold">{map.name}</h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Use this map as the foundation for your new virtual
                        space.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="create"
                      onClick={() => {
                        setSelectedMap(map);
                        setIsOpen();
                      }}
                    >
                      Create Space
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
