import api from "./api";

export const BookService = {
  getBooks: async (page = 1, size = 10, title = '') => {
    return api.get("/api/v1/books", {
      params: {
        title,
        pageNumber: page - 1,
        pageSize: size,
      },
    });
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
};
