'use client'

import { BookService } from '@/services/books.service';
import { UserService } from '@/services/user.services';
import { BookType } from '@/types/book';
import { UserType } from '@/types/user';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';

interface UseQueriesOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialOrderBy?: string;
  initialIsAscending?: boolean;
  initialResourceType?: 'books' | 'users';
}

export const useQueries = ({ 
  initialPage = 1, 
  initialPageSize = 10,
  initialOrderBy = 'title',
  initialIsAscending = true,
  initialResourceType = 'books'
}: UseQueriesOptions = {}) => {
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

  const [filters, setFilters] = useQueryState('filters', {
    history: 'push',
    parse: (value) => {
      try {
        return value ? JSON.parse(decodeURIComponent(value)) : {};
      } catch {
        return {};
      }
    },
    serialize: (value) => {
      return value && Object.keys(value).length > 0 
        ? encodeURIComponent(JSON.stringify(value))
        : '';
    },
    defaultValue: {},
  });

  const [resourceType, setResourceType] = useState<'books' | 'users'>(initialResourceType);

  const [books, setBooks] = useState<BookType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (resourceType === 'books') {
          const response = await BookService.getBooks(
            page, 
            pageSize, 
            searchQuery,
            orderBy,
            isAscending,
            filters 
          );
          const { content, pageable } = response.data;
          setBooks(content);
          setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
          setTotalElements(pageable.totalElements);
        } else {
          const response = await UserService.getUsers(
            page, 
            pageSize, 
            searchQuery,
            orderBy,
            isAscending
          );
          const { content, pageable } = response.data;
          setUsers(content);
          setTotalPages(Math.ceil(pageable.totalElements / pageable.pageSize));
          setTotalElements(pageable.totalElements);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resourceType, searchQuery, page, pageSize, orderBy, isAscending, filters]); 

  const handleOrderChange = (newOrderBy: string) => {
    if (newOrderBy === orderBy) {
      setIsAscending(!isAscending);
    } else {
      setOrderBy(newOrderBy);
      setIsAscending(true);
    }
    setPage(1);
  };

  const handleResourceTypeChange = (type: 'books' | 'users') => {
    if (type === 'books') {
      setOrderBy('title');
    } else {
      setOrderBy('username');
    }
    setResourceType(type);
    setIsAscending(true);
    setPage(1);
    setFilters({}); 
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