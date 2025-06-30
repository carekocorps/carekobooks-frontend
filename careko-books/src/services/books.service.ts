import { BookType } from "@/types/book";
import api from "./api";

interface BookFilters {
  authorName?: string;
  publisherName?: string;
  genre?: string;
  publishedBefore?: string;
  publishedAfter?: string;
  pageCountLower?: number;
  pageCountGreater?: number;
  createdBefore?: string;
  createdAfter?: string;
}

export const BookService = {
  getBooks: async (
    page = 1,
    size = 10,
    title = '',
    orderBy = 'title',
    isAscending = true,
    filters: BookFilters = {}
  ) => {
    const cleanedFilters: Partial<BookFilters> = Object.fromEntries(
      Object.entries(filters).filter(([value]) => value !== undefined && value !== '')
    ) as Partial<BookFilters>;

    return api.get("/api/v1/books", {
      params: {
        title,
        pageNumber: page - 1,
        pageSize: size,
        orderBy,
        isAscendingOrder: isAscending,
        ...cleanedFilters,
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
    image?: File | null;
  }) => {
    const formData = new FormData();

    const bookRequest = {
      title: bookData.title,
      synopsis: bookData.synopsis,
      authorName: bookData.authorName,
      publisherName: bookData.publisherName,
      publishedAt: bookData.publishedAt,
      pageCount: bookData.pageCount,
      genres: bookData.genres ?? [],
    };
    formData.append(
      "request",
      new Blob([JSON.stringify(bookRequest)], { type: "application/json" })
    );
    if (bookData.image instanceof File) {
      if (!bookData.image.type.match(/image\/(jpeg|png|gif|webp)/)) {
        throw new Error("Apenas imagens JPEG, PNG, GIF ou WebP são permitidas");
      }
      formData.append("image", bookData.image, bookData.image.name);
    }
    return api.post("/api/v1/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateBook: async (
    id: number,
    data: {
      title?: string;
      synopsis?: string;
      authorName?: string;
      publisherName?: string;
      publishedAt?: string; 
      pageCount?: number;
      genres?: string[];
      image?: File | null;
      retainCurrentImage?: boolean;
    }
  ): Promise<BookType> => {
    const formData = new FormData();

    const bookData = {
      title: data.title,
      synopsis: data.synopsis,
      authorName: data.authorName,
      publisherName: data.publisherName,
      publishedAt: data.publishedAt,
      pageCount: data.pageCount,
      genres: data.genres ?? [],
      retainCurrentImage: data.retainCurrentImage ?? true
    };
    formData.append(
      "request",
      new Blob([JSON.stringify(bookData)], { type: "application/json" })
    );

    if (data.image instanceof File) {
      if (!data.image.type.match(/image\/(jpeg|png|gif|webp)/)) {
        throw new Error("Apenas imagens JPEG, PNG, GIF ou WebP são permitidas");
      }
      formData.append("image", data.image, data.image.name);
    }

    const response = await api.put(`/api/v1/books/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  clearBookCache: async () => {
    return api.delete("/api/v1/books/cache");
  },

  assignGenre: async (id: number, genreName: string) => {
    return api.post(`/api/v1/books/${id}/genres/${genreName}`);
  }
};