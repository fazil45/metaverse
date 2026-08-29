"use client";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useRef, useState } from "react";
import { HTTP_URL } from "../../utils/import";
import { toast } from "sonner";
import Image from "next/image";
import { errorHandler } from "../../utils/errorHandler";

export default function CreateMapPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [tiledJsonUrl, setTiledJsonUrl] = useState("");
  const [tilesetImageUrl, setTilesetImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mapWidth, setMapWidth] = useState<number | null>(null);
  const [mapHeight, setMapHeight] = useState<number | null>(null);

  const fileForm = useForm({
    defaultValues: {
      tiledJsonFile: null as File | null,
      tilesetImageFile: null as File | null,
    },
    onSubmit: async ({ value }) => {
      try {
        const tiledJson = value.tiledJsonFile;
        const tiledImage = value.tilesetImageFile;

        setJsonFile(tiledJson);

        if (!tiledJson || !tiledImage) {
          toast.error("Please select both files");
          return;
        }

        setIsUploading(true);

        const formData = new FormData();

        formData.append("tiledJson", tiledJson);
        formData.append("tileset", tiledImage);
        const response = await axios.post(
          `${HTTP_URL}/admin/upload`,
          formData,
          {
            withCredentials: true,
          },
        );
        console.log(response.data);
        if (response.data.success) {
          setTilesetImageUrl(response.data.tilesetImageUrl);
          setTiledJsonUrl(response.data.tiledJsonUrl);
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  function handleJsonFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = JSON.parse(String(reader.result));
      setMapWidth(parsed.width);
      setMapHeight(parsed.height);
    };
    reader.readAsText(file);
  }

  const handleMapSubmit = async () => {
    try {
      if (!jsonFile) {
        return;
      }
      await handleJsonFile(jsonFile);

      if (!nameRef.current || !thumbnailRef.current) {
        return;
      }

      const name = nameRef.current.value;
      const thumbnail = thumbnailRef.current.value;

      const response = await axios.post(
        `${HTTP_URL}/admin/map`,
        {
          name,
          dimensions: `${mapWidth}x${mapHeight}`,
          thumbnail: thumbnail,
          tiledJsonUrl,
          tilesetImageUrl,
          defaultElements: [],
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="min-h-screen w-full  font-sans">
      <header className="relative border-b border-[#2A322C] px-8 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A25C] font-mono">
            Import &amp; Draft
          </p>
          <h1 className="mt-1 text-2xl font-semibold ">Create Map</h1>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-8 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Files */}
            <section>
              <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-[#C9A25C] font-mono">
                Files
              </h2>
              <form
                onSubmit={(e) => {
                  (e.preventDefault(), fileForm.handleSubmit());
                }}
              >
                <div className="space-y-3">
                  <fileForm.Field
                    name="tiledJsonFile"
                    children={(field) => {
                      return (
                        <div>
                          <label className="mb-1 block text-sm">
                            Tiled JSON (.json / .tmj)
                          </label>

                          <input
                            type="file"
                            accept=".json,.tmj"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              field.handleChange(file);
                            }}
                            onBlur={field.handleBlur}
                            className="w-full cursor-pointer rounded-md border border-neutral-700 dark:bg-neutral-900 text-xs text-neutral-400
                              file:mr-3
                              file:cursor-pointer
                              file:border-0
                              file:border-r
                              file:border-neutral-700
                            file:bg-neutral-800
                            file:px-3
                        file:py-2
                        file:text-xs
                        file:font-medium
                        file:text-neutral-200
                        hover:file:bg-neutral-700"
                          />
                        </div>
                      );
                    }}
                  />

                  <fileForm.Field
                    name="tilesetImageFile"
                    children={(field) => {
                      return (
                        <div>
                          <label className="mb-1 block text-sm">
                            Tileset image
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              field.handleChange(file);
                            }}
                            onBlur={field.handleBlur}
                            className="w-full cursor-pointer rounded-md border border-neutral-700 dark:bg-neutral-900 text-xs text-neutral-400
                        file:mr-3
                        file:cursor-pointer
                        file:border-0
                        file:border-r
                        file:border-neutral-700
                        file:bg-neutral-800
                        file:px-3
                        file:py-2
                        file:text-xs
                        file:font-medium
                        file:text-neutral-200
                        hover:file:bg-neutral-700"
                          />
                        </div>
                      );
                    }}
                  />

                  <p className="text-xs font-mono">
                    28&times;14 tiles · 3 tile layers · 12 collidable tiles
                  </p>

                  <button
                    type="submit"
                    className="rounded-md border border-[#C9A25C] px-3 py-1.5 text-xs text-[#C9A25C]"
                  >
                    {isUploading ? "Uploading" : "Upload export"}
                  </button>

                  <p className="text-xs text-[#8FBF9F]">
                    Export uploaded — ready to create.
                  </p>
                </div>
              </form>
            </section>

            {/* Layers */}
            <section>
              <h2 className="mb-2 text-xs uppercase tracking-[0.2em] text-[#C9A25C] font-mono">
                Layers
              </h2>
              <ul className="space-y-1">
                {["ground", "walls", "objects"].map((layer) => (
                  <li
                    key={layer}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 font-mono ">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#C9A25C]" />
                      {layer}
                    </span>
                  </li>
                ))}
              </ul>
              <label className="mt-3 flex items-center gap-2 text-xs ">
                <input type="checkbox" defaultChecked />
                Highlight isCollide tiles
              </label>
            </section>
          </div>

          {/* Right column: preview */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#e1b157] font-mono">
              Preview
            </h2>
            <div className="flex items-center justify-center rounded-lg border p-4">
              {tilesetImageUrl ? (
                <Image
                  width={600}
                  height={600}
                  className="h-72 w-full rounded border border-dashed"
                  alt="image"
                  src={`${tilesetImageUrl}`}
                />
              ) : (
                <div className="h-72 w-full rounded border border-dashed dark:bg-black bg-neutral-300" />
              )}
            </div>
            <p className="text-xs text-[#6E7369]">
              Gold outlines mark tiles with the{" "}
              <code className="text-[#D8DACB]">isCollide</code> property set to
              true.
            </p>
            {/* Details */}
            <section>
              <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-[#C9A25C] font-mono">
                Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm ">Map name</label>
                  <input
                    ref={nameRef}
                    placeholder="Space name"
                    className="w-full rounded-md border border-[#2A322C] bg-transparent px-3 py-2 text-sm  outline-none focus:border-[#C9A25C]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm ">Map thumbnail</label>
                  <input
                    ref={thumbnailRef}
                    placeholder="Space thumbnail"
                    className="w-full rounded-md border border-[#2A322C] bg-transparent px-3 py-2 text-sm  outline-none focus:border-[#C9A25C]"
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-4 border-t border-[#2A322C] pt-6">
              <button
                type="button"
                onClick={handleMapSubmit}
                className="rounded-md bg-[#C9A25C] px-5 py-2.5 text-sm font-medium "
              >
                Create map
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
