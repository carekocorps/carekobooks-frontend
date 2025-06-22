'use client';

import { BookService } from '@/services/books.service';
import { UserService } from '@/services/user.services';
import { BookType } from '@/types/book';
import { UserType } from '@/types/user';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, startTransition } from 'react';
import { useQueryState } from 'nuqs';

interface UseQueriesOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialOrderBy?: string;
  initialIsAscending?: boolean;
  initialResourceType?: 'books' | 'users';
}

interface BookFilters {
  authorName?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  pageCountGreater?: number;
  pageCountLower?: number;
  genre?: string;
}

export const useQueries = ({
  initialPage = 1,
  initialPageSize = 10,
  initialOrderBy = 'title',
  initialIsAscending = true,
  initialResourceType = 'books',
}: UseQueriesOptions = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [page, setPage] = useQueryState('page',   { history: 'push', shallow: true, parse: Number, defaultValue: initialPage });
  const [pageSize, setPageSize] = useQueryState('pageSize', { history: 'push', shallow: true, parse: Number, defaultValue: initialPageSize });
  const [orderBy, setOrderBy] = useQueryState('orderBy', { history: 'push', shallow: true, defaultValue: initialOrderBy });
  const [isAscending, setIsAscending] = useQueryState('isAscending', {
    history: 'push',
    shallow: true,
    parse: v => v === 'true',
    serialize: v => v.toString(),
    defaultValue: initialIsAscending,
  });
  const [filters, setFilters] = useQueryState('filters', {
    history: 'push',
    shallow: true,
    parse: v => {
      try { return v ? JSON.parse(decodeURIComponent(v)) : {}; }
      catch { return {}; }
    },
    serialize: v =>
      v && Object.keys(v).length > 0
        ? encodeURIComponent(JSON.stringify(v))
        : '',
    defaultValue: {},
  });

  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  const [resourceType, setResourceType] = useState<'books' | 'users'>(initialResourceType);
  const [books, setBooks] = useState<BookType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const parsedFilters = (filtersString && JSON.parse(filtersString)) as BookFilters;

      try {
        if (resourceType === 'books') {
          const res = await BookService.getBooks(
            page, pageSize, searchQuery,
            orderBy, isAscending,
            parsedFilters
          );
          if (res.status >= 200 && res.status < 300) {
            const { content, pageable } = res.data;
            setBooks(content);
            setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
            setTotalElements(pageable.totalElements);
          }
        } else {
          const res = await UserService.getUsers(
            page, pageSize, searchQuery,
            orderBy, isAscending
          );
          if (res.status >= 200 && res.status < 300) {
            const { content, pageable } = res.data;
            setUsers(content);
            setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
            setTotalElements(pageable.totalElements);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [
    resourceType,
    searchQuery,
    page,
    pageSize,
    orderBy,
    isAscending,
    filtersString, 
  ]);

  const handleOrderChange = (newOrderBy: string) => {
    startTransition(() => {
      setPage(1);
      if (newOrderBy === orderBy) {
        setIsAscending(!isAscending);
      } else {
        setOrderBy(newOrderBy);
        setIsAscending(true);
      }
    });
  };

  const handleResourceTypeChange = (type: 'books' | 'users') => {

    startTransition(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('page', '1');
      params.set('orderBy', type === 'books' ? 'title' : 'username');
      params.set('isAscending', 'true');
      params.delete('filters');
      router.replace(`?${params.toString()}`);
      setResourceType(type);
    });
  };

  return {
    books,
    users,
    loading,
    searchQuery,
    resourceType,
    page,
    setPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    orderBy,
    isAscending,
    handleOrderChange,
    handleResourceTypeChange,
    filters,
    setFilters,
    setResourceType,
  };
};
