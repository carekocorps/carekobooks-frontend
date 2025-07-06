import api from "./api";

export const UserSocialService = {
  getFollowers: async (
    username: string,
    params: {
      targetUsername?: string;
      targetDisplayName?: string;
      createdBefore?: Date;
      createdAfter?: Date;
      pageNumber?: number;
      pageSize?: number;
      orderBy?: "id" | "username" | "createdAt" | "updatedAt";
      isAscendingOrder?: boolean;
    } = {}
  ) => {
    const {
      targetUsername,
      targetDisplayName,
      createdBefore,
      createdAfter,
      pageNumber = 0,
      pageSize = 10,
      orderBy = "id",
      isAscendingOrder = true,
    } = params;

    return api.get(`/v1/users/${username}/social/followers`, {
      params: {
        targetUsername,
        targetDisplayName,
        createdBefore: createdBefore?.toISOString(),
        createdAfter: createdAfter?.toISOString(),
        pageNumber,
        pageSize,
        orderBy,
        isAscendingOrder,
      },
    });
  },

  getFollowing: async (
    username: string,
    params: {
      targetUsername?: string;
      targetDisplayName?: string;
      createdBefore?: Date;
      createdAfter?: Date;
      pageNumber?: number;
      pageSize?: number;
      orderBy?: "id" | "username" | "createdAt" | "updatedAt";
      isAscendingOrder?: boolean;
    } = {}
  ) => {
    const {
      targetUsername,
      targetDisplayName,
      createdBefore,
      createdAfter,
      pageNumber = 0,
      pageSize = 10,
      orderBy = "id",
      isAscendingOrder = true,
    } = params;

    return api.get(`/v1/users/${username}/social/following`, {
      params: {
        targetUsername,
        targetDisplayName,
        createdBefore: createdBefore?.toISOString(),
        createdAfter: createdAfter?.toISOString(),
        pageNumber,
        pageSize,
        orderBy,
        isAscendingOrder,
      },
    });
  },

  followUser: async (username: string, targetUsername: string) => {
    return api.post(`/v1/users/${username}/social/following/${targetUsername}`);
  },

  unfollowUser: async (username: string, targetUsername: string) => {
    return api.delete(`/v1/users/${username}/social/following/${targetUsername}`);
  },
};
