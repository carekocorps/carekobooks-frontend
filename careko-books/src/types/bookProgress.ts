import { BookType } from "./book";

export type ProgressResponse = {
  content: BookProgress[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
  };
};

export type BookProgress = {
  id: number;
  status: "PLANS_TO_READ" | "READING" | "FINISHED";
  isFavorite: boolean;
  score: number;
  pageCount: number;
  username: string;
  bookId: number;
  book: BookType;
};

export type CreateBookProgress = Omit<BookProgress, "id">;
export type UpdateBookProgress = Omit<BookProgress, "id"> & { id: number };