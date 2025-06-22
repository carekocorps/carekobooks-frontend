  import api from "./api";
import { ProgressResponse, CreateBookProgress, UpdateBookProgress, BookProgress } from "@/types/bookProgress";

interface ProgressFilters {
  username?: string;
  bookId?: number;
  status?: "PLANS_TO_READ" | "READING" | "FINISHED";
  isFavorite?: boolean;
  score?: number;
  pageCount?: number;
  genre?: string;
  createdBefore?: string;
  createdAfter?: string;
}

export const ProgressService = {
  getProgresses: async (
    page = 1,
    size = 10,
    orderBy = 'createdAt',
    isAscending = false,
    filters: ProgressFilters = {}
  ) => {
    const cleanedFilters: Partial<ProgressFilters> = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    ) as Partial<ProgressFilters>;

    const response = await api.get<ProgressResponse>("/api/v1/books/progresses", {
      params: {
        pageNumber: page - 1,
        pageSize: size,
        orderBy,
        isAscendingOrder: isAscending,
        ...cleanedFilters,
      },
    });

    return response.data;
  },

  createProgress: async (data: CreateBookProgress) => {
    const response = await api.post<BookProgress>("/api/v1/books/progresses", data);
    return response.data;
  },

   updateProgress: async (id: number, data: UpdateBookProgress) => {
    const res = await api.put<BookProgress>(`/api/v1/books/progresses/${id}`, data);
    return res.data;
  },

  deleteProgress: async (id: number) => {
    const res = await api.delete(`/api/v1/books/progresses/${id}`);
    return res.data;
  },

  favorite: async (id: number) => {
    const res = await api.post<BookProgress>(`/api/v1/books/progresses/${id}/favorites`);
    return res.data;
  },

  unfavorite: async (id: number) => {
    const res = await api.delete<BookProgress>(`/api/v1/books/progresses/${id}/favorites`);
    return res.data;
  },

  getProgressById: async (id: number) => {
    const res = await api.get<BookProgress>(`/api/v1/books/progresses/${id}`);
    return res.data;
  },

  getProgressByUserAndBook: async (username: string, bookId: number) => {
    const response = await ProgressService.getProgresses(
      1, 
      1, 
      'createdAt', 
      false, 
      { username, bookId }
    );
    return response.content.length > 0 ? response.content[0] : null;
  }
};