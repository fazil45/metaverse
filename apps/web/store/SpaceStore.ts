import { create } from "zustand";
import axios from "axios";
import { HTTP_URL } from "../utils/import";
import { toast } from "sonner";
import { errorHandler } from "../utils/errorHandler";
import { Maps, Spaces } from "../types/types";

type SpaceStore = {
  creatingSpace: boolean;
  isFetchingSpace: boolean;
  totalPages: number;
  spaces: Spaces[];

  createSpace: (map: Maps, onSuccess?: () => void) => Promise<void>;

  fetchSpace: (pageNumber: number) => Promise<void>;
};

export const useSpaceStore = create<SpaceStore>((set) => ({
  creatingSpace: false,
  isFetchingSpace: false,
  totalPages: 1,
  spaces: [],

  createSpace: async (map, onSuccess) => {
    try {
      set({ creatingSpace: true });

      const response = await axios.post(
        `${HTTP_URL}/space/create`,
        {
          name: map.name,
          thumbnail: map.thumbnail,
          dimensions: `${map.width}x${map.height}`,
          mapId: map.id,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        onSuccess?.();
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      set({ creatingSpace: false });
    }
  },

  fetchSpace: async (pageNumber: number) => {
    try {
      set({ isFetchingSpace: true });
      const response = await axios.get(`${HTTP_URL}/space/all`, {
        params: { page: pageNumber },
        withCredentials: true,
      });

      if (response.data.success) {
        set({ spaces: response.data.spaces });
        set({ totalPages: response.data.pagination.totalPages });
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      set({ isFetchingSpace: false });
    }
  },

}));
