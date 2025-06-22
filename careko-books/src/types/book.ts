import { ImageType } from "./image";

export type BookResponse = {
  content: BookType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
  };
};

export type BookType = {
  id: number;
  title: string;
  synopsis: string;
  authorName: string;
  publisherName: string;
  publishedAt: string; 
  pageCount: number;
  userAverageScore: number | null;
  reviewAverageScore: number | null;
  createdAt: string;
  updatedAt: string;
  image: ImageType;
  genres: Genre[];
};


export type Genre = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

