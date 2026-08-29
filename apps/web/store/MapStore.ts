import {create} from "zustand"
import { Maps } from "../types/types"
import { errorHandler } from "../utils/errorHandler";
import { toast } from "sonner";
import axios from "axios";
import { HTTP_URL } from "../utils/import";

type MapStoreState = {
    maps:Maps[];
    isFetchingMap:boolean;
    fetchMaps:() => Promise<void>
}

export const useMapStore = create<MapStoreState>((set) =>({
    maps:[],
    isFetchingMap:false,
    
    fetchMaps: async () => {
    try {
      set({isFetchingMap:true});
      const response = await axios.get(`${HTTP_URL}/user/maps`, {
        withCredentials: true,
      });

      if (response.data.success) {
        set({maps:response.data.maps});
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      set({isFetchingMap:false});
    }
  },
}))