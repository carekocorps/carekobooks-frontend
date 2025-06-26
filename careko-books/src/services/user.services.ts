import { UserType } from "@/types/user";
import api from "./api";


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

  updateUser: async (username: string, data: { 
    username?: string; 
    displayName?: string; 
    description?: string;
    image?: File;
  }): Promise<UserType> => {
    const formData = new FormData();
    const userData = {
      username: data.username,
      displayName: data.displayName,
      description: data.description
    };
    formData.append(
      "request",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    if (data.image instanceof File) {
      if (!data.image.type.match(/image\/(jpeg|png|gif|webp)/)) {
        throw new Error("Apenas imagens JPEG, PNG, GIF ou WebP são permitidas");
      }
      formData.append("image", data.image, data.image.name);
    }

    const response = await api.put(`/api/v1/users/${username}`, formData, {
      headers: {
        'Content-Type': undefined
      },
      transformRequest: (data) => data,
    });

    return response.data;
  },
};