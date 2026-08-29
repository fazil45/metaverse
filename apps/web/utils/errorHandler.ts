import axios from "axios";
import { toast } from "sonner";

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data.errorMessage || "Something went wrong");
  } else {
    toast.error("Something went wrong");
  }
};
