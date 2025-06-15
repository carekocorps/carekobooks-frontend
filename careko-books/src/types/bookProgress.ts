export type BookProgress = {
  id: number;
  status: "PLANS_TO_READ" | "READING" | "FINISHED";
  isFavorite: boolean;
  score: number;
  pageCount: number;
  username: string;
  bookId: number;
};

export type CreateBookProgress = Omit<BookProgress, "id">;
export type UpdateBookProgress = Partial<Omit<BookProgress, "id">> & { id: number };