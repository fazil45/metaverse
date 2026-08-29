import { ArrowRight, LogIn, Trash2 } from "lucide-react";
import React from "react";
import Button from "./Button";
import { Spaces } from "../types/types";
import axios from "axios";
import { HTTP_URL } from "../utils/import";
import { toast } from "sonner";

const SpaceCard = ({ space }: { space: Spaces }) => {

    const deleteSpace = async (spaceId:string) => {
        try {
            const response = await axios.delete(`${HTTP_URL}/space/delete/${spaceId}`,{
                withCredentials:true
            })

            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            
        }
    }
    
  return (
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

          <Button onClick={() => {}} variant="secondary" type="button">
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
};

export default SpaceCard;
