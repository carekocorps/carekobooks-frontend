export type GenreResponse = {
  content: GenreType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
  };
};

export type GenreType = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
