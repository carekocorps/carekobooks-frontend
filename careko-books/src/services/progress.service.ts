import { BookProgress, CreateBookProgress, UpdateBookProgress } from "@/types/bookProgress";
import api from "./api";

export const ProgressService = {
  createProgress: async (data: CreateBookProgress) => {
    const res = await api.post<BookProgress>("/api/v1/books/progresses", data);
    return res.data;
  },

  getProgressByUserAndBook: async (username: string, bookId: number) => {
    const res = await api.get<BookProgress>(`/api/v1/books/${bookId}/progress`, {
      params: { username },
    });
    return res.data;
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
};