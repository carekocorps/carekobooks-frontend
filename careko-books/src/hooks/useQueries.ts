'use client'

import { BookService } from '@/services/books.service';
import { BookType } from '@/types/book';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';

export const useQueries = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [page] = useQueryState('page', {
    history: 'push',
    parse: Number,
    defaultValue: 1,
  });

  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = await BookService.getBooks(page, pageSize, searchQuery);
        const { content, pageable } = response.data;

        setBooks(content)
        setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
      } finally {
        setLoading(false)
      }
    };

    fetchBooks();
  }, [searchQuery, page]);

  return {
    books,
    loading,
    searchQuery,
    page,
    totalPages,
  };
};
