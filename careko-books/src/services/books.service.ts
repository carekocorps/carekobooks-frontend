import api from "./api";

export const BookService = {
  getBooks: async (page = 1, size = 10, title = '', orderBy = 'title',
    isAscending = true
) => {
    return api.get("/api/v1/books", {
      params: {
        title,
        pageNumber: page - 1,
        pageSize: size,
        orderBy: orderBy,
        isAscendingOrder: isAscending,
      },
    });
  },

  getBookById: async (id: number) => {
    return api.get(`/api/v1/books/${id}`);
  },

  deleteBook: async (id: number) => {
    return api.delete(`/api/v1/books/${id}`);
  },

  createBook: async (bookData: {
    title: string;
    synopsis: string;
    authorName: string;
    publisherName: string;
    publishedAt: string;
    pageCount: number;
    genres: string[];
  }) => {
    return api.post("/api/v1/books", bookData);
  },

    updateBook: async (
    id: number,
    bookData: {
      title: string;
      synopsis: string;
      authorName: string;
      publisherName: string;
      publishedAt: string;
      pageCount: number;
      genres: string[];
    }
  ) => {
    return api.put(`/api/v1/books/${id}`, bookData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  clearBookCache: async () => {
    return api.delete("/api/v1/books/cache");
  },

  assignGenre: async(id: number, genreName: string) => {
    return api.post(`/api/v1/books/${id}/genres/${genreName}`);
  }
};
