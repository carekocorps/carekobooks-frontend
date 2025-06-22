import { ProgressService } from '@/services/progress.service';
import { useState, useEffect } from 'react';

type ProgressStatus = "PLANS_TO_READ" | "READING" | "FINISHED";

interface useStatusProps{
  username: string | null | undefined,
  status: ProgressStatus
}

export const useStatusProgresses = ({username, status}: useStatusProps) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setCount(0);
      return;
    }

    const fetchStatusProgresses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ProgressService.getProgresses(
          1, 
          1, 
          'createdAt',
          false,
          { 
            username, 
            status 
          }
        );

        setCount(response.pageable.totalElements);
      } catch (err: any) {
        setError(err.message || `Erro ao carregar progressos com status ${status}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusProgresses();
  }, [username, status]);

  return { count, loading, error };
};