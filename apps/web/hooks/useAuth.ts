import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HTTP_URL } from "../utils/import";

interface User {
  data: {
    user: {
      username: string;
      id: string;
      role: "User" | "Admin";
    };
  };
}

export const useAuth = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response: User = await axios.get(`${HTTP_URL}/auth/me`, {
        withCredentials: true,
      });

      return response.data.user;
    },
    retry: false,
  });
};
