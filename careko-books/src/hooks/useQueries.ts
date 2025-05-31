'use client'

import { BookService } from '@/services/books.service';
import { BookType } from '@/types/book';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';

interface UseQueriesOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export const useQueries = ({ initialPage = 1, initialPageSize = 10 }: UseQueriesOptions = {}) => {
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

  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = await BookService.getBooks(page, pageSize, searchQuery);
        const { content, pageable } = response.data;

        setBooks(content);
        setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, page, pageSize]);

  return {
    books,
    loading,
    searchQuery,
    page,
    setPage,
    totalPages,
    pageSize,
    setPageSize,
  };
};
