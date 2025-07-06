import { UserType } from "@/types/user";
import api from "./api";

export interface RegisterPayload {
  username: string;
  displayName: string;
  email: string;
  description: string;
  avatar?: File | null;
}

export const UserService = {
  getUsers: async (page = 1, size = 10, username = '', orderBy = 'username',
    isAscending = true
) => {
    return api.get("/v1/users", {
      params: {
        username,
        pageNumber: page - 1,
        pageSize: size,
        orderBy: orderBy,
        isAscendingOrder: isAscending,
      },
    });
  },

  register: async (data: RegisterPayload) => {
    const formData = new FormData();
    const { avatar, ...rest } = data;
    formData.append(
      "request",
      new Blob([JSON.stringify(rest)], { type: "application/json" })
    );
    if (avatar instanceof File) {
      const allowed = ["jpeg", "png", "gif", "webp"];
      const ext = avatar.type.split("/")[1];
      if (!allowed.includes(ext)) {
        throw new Error("Apenas JPEG, PNG, GIF ou WebP são permitidas");
      }
      formData.append("avatar", avatar, avatar.name);
    }
    const response = await api.post("/v1/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<UserType> => {
    const response = await api.get(`/v1/users/${username}`);
    return response.data;
  },

  updateUser: async (username: string, data: { 
    username?: string; 
    displayName?: string; 
    description?: string;
    image?: File | null;
    retainCurrentImage?: boolean;
  }): Promise<UserType> => {
    const formData = new FormData();
    const userData = {
      username: data.username,
      displayName: data.displayName,
      description: data.description,
      retainCurrentImage: data.retainCurrentImage ?? true
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
    const response = await api.put(`/v1/users/${username}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },
};