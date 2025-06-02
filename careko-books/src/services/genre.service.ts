import api from "./api";

export const GenreService = {
  getGenres: async (
    page = 1,
    size = 10,
    name = '',
    orderBy = 'name',
    isAscending = true
  ) => {
    return api.get("/api/v1/books/genres", {
      params: {
        name,
        pageNumber: page - 1,
        pageSize: size,
        orderBy,
        isAscendingOrder: isAscending,
      },
    });
  },

  getGenreByName: async (name: string) => {
    return api.get(`/api/v1/books/genres/${name}`);
  },

  createGenre: async (data: { name: string; displayName: string; description: string }) => {
    return api.post("/api/v1/books/genres", data);
  },

  updateGenre: async (name: string, data: { name: string; displayName: string; description: string }) => {
    return api.put(`/api/v1/books/genres/${name}`, data);
  },

  deleteGenre: async (name: string) => {
    return api.delete(`/api/v1/books/genres/${name}`);
  },

  clearGenreCache: async () => {
    return api.delete("/api/v1/books/genres/cache");
  }
};
