'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { GenreService } from '@/services/genre.service';
import { GenreType } from '@/types/genre';

interface UseGenreQueriesOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialOrderBy?: string;
  initialIsAscending?: boolean;
}

export const useGenreQueries = ({
  initialPage = 1,
  initialPageSize = 10,
  initialOrderBy = 'name',
  initialIsAscending = true,
}: UseGenreQueriesOptions = {}) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [page, setPage] = useQueryState('page', {
    history: 'push',
    parse: Number,
    defaultValue: initialPage,
  });

  const [pageSize, setPageSize] = useQueryState('pageSize', {
    history: 'push',
    parse: Number,
    defaultValue: initialPageSize,
  });

  const [orderBy, setOrderBy] = useQueryState('orderBy', {
    history: 'push',
    defaultValue: initialOrderBy,
  });

  const [isAscending, setIsAscending] = useQueryState('isAscending', {
    history: 'push',
    parse: (value) => value === 'true',
    serialize: (value) => value.toString(),
    defaultValue: initialIsAscending,
  });

  const [genres, setGenres] = useState<GenreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const response = await GenreService.getGenres(
          page,
          pageSize,
          searchQuery,
          orderBy,
          isAscending
        );
        const { content, pageable } = response.data;
        setGenres(content);
        setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
        setTotalElements(pageable.totalElements);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [searchQuery, page, pageSize, orderBy, isAscending]);

  const handleOrderChange = (newOrderBy: string) => {
    if (newOrderBy === orderBy) {
      setIsAscending(!isAscending);
    } else {
      setOrderBy(newOrderBy);
      setIsAscending(true);
    }
    setPage(1);
  };

  return {
    genres,
    loading,
    searchQuery,

    page,
    setPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,

    orderBy,
    isAscending,
    handleOrderChange,
  };
};
