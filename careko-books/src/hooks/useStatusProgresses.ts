import { ProgressService } from '@/services/progress.service';
import { useState, useEffect } from 'react';
import { BookProgress } from '@/types/bookProgress'; 

export type ProgressStatus = "PLANS_TO_READ" | "READING" | "FINISHED" | "FAVORITES";

interface UseStatusProgressesOptions {
  username: string | null | undefined;
  status: ProgressStatus;
  page?: number;
  perPage?: number;
}

export const useStatusProgresses = ({
  username,
  status,
  page = 1,
  perPage = 12
}: UseStatusProgressesOptions) => {
  const [count, setCount] = useState<number>(0);
  const [progresses, setProgresses] = useState<BookProgress[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setCount(0);
      setProgresses([]);
      setTotalPages(0);
      return;
    }

    const fetchStatusProgresses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters: any = { username };
        
        if (status !== "FAVORITES") {
          filters.status = status;
        } else {
          filters.isFavorite = true;
        }

        const response = await ProgressService.getProgresses(
          page, 
          perPage, 
          'createdAt',
          false,
          filters
        );

        setCount(response.pageable.totalElements);
        setProgresses(response.content);
        setTotalPages(Math.ceil(response.pageable.totalElements / response.pageable.pageSize));
      } catch (err: any) {
        setError(err.message || `Erro ao carregar progressos com status ${status}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusProgresses();
  }, [username, status, page, perPage]); 

  return { 
    count, 
    progresses, 
    loading, 
    error,
    totalPages
  };
};