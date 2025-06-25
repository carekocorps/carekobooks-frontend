import { BookType } from "./book";
import { UserType } from "./user";

export type BookReview = {
  id: number;
  title: string;
  content: string;
  score: number;
  user: UserType;
  book: BookType;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBookReview  = {
  title: string;
  content: string;
  score: number;
  username: string;
  bookId: number;
};

export type UpdateBookReview = Partial<Omit<CreateBookReview, 'id' | 'createdAt' | 'updatedAt'>> & { id: number };