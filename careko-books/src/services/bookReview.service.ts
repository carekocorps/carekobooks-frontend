import { BookReview, CreateBookReview, UpdateBookReview } from "@/types/bookReview";
import api from "./api";

export const ReviewService = {
  createReview: async (data: CreateBookReview) => {
    const res = await api.post<BookReview>("/v1/books/reviews", data);
    return res.data;
  },

  searchReviews: async (params: {
    username?: string;
    bookId?: number;
    score?: number;
    pageSize?: number;
    pageNumber?: number;
    orderBy?: string;
    isAscendingOrder?: boolean;
  }) => {
    const res = await api.get<{
      content: BookReview[];
      totalPages: number;
      totalElements: number;
    }>("/v1/books/reviews", { params });
    return res.data.content;
  },

  updateReview: async (id: number, data: UpdateBookReview) => {
    const res = await api.put<BookReview>(`/v1/books/reviews/${id}`, data);
    return res.data;
  },

  deleteReview: async (id: number) => {
    const res = await api.delete(`/v1/books/reviews/${id}`);
    return res.data;
  },

  getReviewById: async (id: number) => {
    const res = await api.get<BookReview>(`/v1/books/reviews/${id}`);
    return res.data;
  },

  getReviewByUserAndBook: async (username: string, bookId: number) => {
    const reviews = await ReviewService.searchReviews({
      username,
      bookId,
      pageSize: 1
    });
    return reviews.length > 0 ? reviews[0] : null;
  }
};