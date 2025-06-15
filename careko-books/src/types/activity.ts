export type BookActivity = {
  id: number;
  status: "PLANS_TO_READ" | "READING" | "FINISHED";
  pageCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    displayName: string;
    image: {
      url: string;
    } | null;
  };
  book: {
    id: number;
    title: string;
    authorName: string;
    image: {
      url: string;
    };
  };
};

export type ActivityFilterParams = {
  username?: string;
  feed?: string; 
  genre?: string;
  status?: string;
  pageCount?: number;
  bookId?: number;
  createdBefore?: string;
  createdAfter?: string;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  isAscendingOrder?: boolean;
};

export type ActivityResponse = {
  content: BookActivity[];
  totalElements: number;
  totalPages: number;
};