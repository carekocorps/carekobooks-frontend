import { GenreService } from '@/services/genre.service';
import { ProgressService } from '@/services/progress.service';
import { GenreType } from '@/types/genre';
import { useState, useEffect, useCallback } from 'react';

interface GenreProgress {
  genreName: string;
  genreDisplayName: string;
  count: number;
  progress: number; 
}

interface UseGenreProgressesProps {
  username: string | null;
  maxGenres?: number;
}

export const useGenreProgresses = ({ 
  username, 
  maxGenres = 5 
}: UseGenreProgressesProps) => {
  const [genreProgresses, setGenreProgresses] = useState<GenreProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProgresses, setTotalProgresses] = useState(0);

  const fetchGenreProgresses = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [genresResponse, totalResponse] = await Promise.all([
        GenreService.getGenres(1, 50),
        ProgressService.getProgresses(1, 1, 'createdAt', false, { username })
      ]);
      
      const total = totalResponse.pageable.totalElements;
      setTotalProgresses(total);
      
      if (total === 0) {
        setGenreProgresses([]);
        setLoading(false);
        return;
      }
      
      const allGenres = genresResponse.data.content;
   
      const progressCounts = await Promise.all(
        allGenres.map(async (genre: GenreType) => {
          try {
            const response = await ProgressService.getProgresses(
              1, 
              1, 
              'createdAt', 
              false, 
              { 
                username, 
                genre: genre.name 
              }
            );
            return {
              genre,
              count: response.pageable.totalElements
            };
          } catch (err) {
            console.error(`Erro ao buscar progressos para ${genre.name}:`, err);
            return {
              genre,
              count: 0
            };
          }
        })
      );
      
      const results = progressCounts
        .filter(item => item.count > 0)
        .map(({ genre, count }) => ({
          genreName: genre.name,
          genreDisplayName: genre.displayName,
          count,
          progress: Math.round((count / total) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, maxGenres);
      
      setGenreProgresses(results);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar progressos por gênero');
    } finally {
      setLoading(false);
    }
  }, [username, maxGenres]);

  useEffect(() => {
    fetchGenreProgresses();
  }, [fetchGenreProgresses]);

  return { 
    genreProgresses, 
    totalProgresses,
    loading, 
    error,
    refresh: fetchGenreProgresses
  };
};