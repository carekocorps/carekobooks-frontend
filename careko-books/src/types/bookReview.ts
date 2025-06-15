export type BookReview = {
  id: number;
  title: string;
  content: string;
  score: number;
  username: string;
  bookId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBookReview = Omit<BookReview, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookReview = Partial<Omit<BookReview, 'id' | 'createdAt' | 'updatedAt'>> & { id: number };