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
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { HTTP_URL } from "../../utils/import";
import { toast } from "sonner";
import { errorHandler } from "../../utils/errorHandler";
import Button from "../../components/Button";

type Maps = {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail: string;
};

type Spaces = {
  id: string;
  name: string;
  thumbnail: string;
  dimensions: string;
};

export default function DashboardPage() {
  const [showMaps, setShowMaps] = useState(false);
  const [spaces, setSpaces] = useState<Spaces[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSpaces = async (pageNumber: number) => {
    try {
      const response = await axios.get(`${HTTP_URL}/space/all`, {
        params: { page: pageNumber },
        withCredentials: true,
      });

      if (response.data.success) {
        setSpaces(response.data.spaces);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    fetchSpaces(page);
  }, [page]);

  const addSpace = () => {
    setPage(1);
    fetchSpaces(1);
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
          x``
          {/* Map Table */}
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

        {spaces.length > 0 ? (
          <div className="grid gap-6  md:grid-cols-2">
            {spaces.map((space) => (
              <article
                key={space.id}
                className="overflow-hidden rounded-md border-2 border-border bg-card shadow-3xl/30 shadow-neutral-700"
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={space.thumbnail}
                    alt={space.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{space.name}</h3>

                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {space.dimensions} · Ready to explore
                      </p>
                    </div>

                    <button
                      type="button"
                      className="grid size-9 shrink-0 place-items-center rounded-lg border-2 border-border transition hover:bg-background"
                      aria-label={`Open ${space.name}`}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => {}} variant="primary" type="button">
                      <LogIn size={14} />
                      Join space
                    </Button>

                    <Button
                      onClick={() => {}}
                      variant="secondary"
                      type="button"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
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

function MapTable({
  setShowMaps,
  onCreation,
}: {
  onCreation: () => void;
  setShowMaps: (value: SetStateAction<boolean>) => void;
}) {
  const [maps, setMaps] = useState<Maps[]>([]);
  const [loading, setLoading] = useState(false)

  const selectMap = async ({ map }: { map: Maps }) => {
    try {
      const response = await axios.post(
        `${HTTP_URL}/space/create`,
        {
          name: map.name,
          thumbnail: map.thumbnail,
          dimensions: `${map.width}x${map.height}`,
          mapId: map.id,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        setShowMaps(false);
        onCreation();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const fetchMap = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${HTTP_URL}/user/maps`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMaps(response.data.maps);
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchMap();
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

        {/* Maps */}
        <div className="grid gap-4 p-5">
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
                    Use this map as the foundation for your new virtual space.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="create"
                  onClick={() => selectMap({ map })}
                >
                  Create Space
                  <ArrowRight size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
