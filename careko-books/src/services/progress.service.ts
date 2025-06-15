import { BookProgress, CreateBookProgress, UpdateBookProgress } from "@/types/bookProgress";
import api from "./api";

export const ProgressService = {
  createProgress: async (data: CreateBookProgress) => {
    const res = await api.post<BookProgress>("/api/v1/books/progresses", data);
    return res.data;
  },

  searchProgresses: async (params: {
    username?: string;
    bookId?: number;
    status?: string;
    isFavorite?: boolean;
    score?: number;
    pageCount?: number;
    pageSize?: number;
    pageNumber?: number;
    orderBy?: string;
    isAscendingOrder?: boolean;
  }) => {
    const res = await api.get<{
      content: BookProgress[];
      totalPages: number;
      totalElements: number;
    }>("/api/v1/books/progresses", { params });
    return res.data.content;
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
    const progresses = await ProgressService.searchProgresses({
      username,
      bookId,
      pageSize: 1
    });
    return progresses.length > 0 ? progresses[0] : null;
  }
};