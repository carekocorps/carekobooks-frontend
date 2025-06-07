import { UserType } from "@/types/user";
import api from "./api";
import { CookieService } from "./cookies.service";


export const UserService = {
  getUsers: async (page = 1, size = 10, title = '', orderBy = 'username',
    isAscending = true
) => {
    return api.get("/api/v1/users", {
      params: {
        title,
        pageNumber: page - 1,
        pageSize: size,
        orderBy: orderBy,
        isAscendingOrder: isAscending,
      },
    });
  },

  getUserByUsername: async (username: string): Promise<UserType> => {
    const response = await api.get(`/api/v1/users/${username}`);
    return response.data;
  },
};