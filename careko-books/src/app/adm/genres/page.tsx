'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkeletonCard } from '@/components/program/skeleton-card';
import GenreCard from '@/components/program/genre/genre-card';
import { PaginationDemo } from '@/components/program/pagination-demo';
import { useGenreQueries } from '@/hooks/useGenreQueries';
import CreateGenreModal from '@/components/program/genre/create-genre-modal';
import { Button } from '@/components/ui/button';
import { GenreService } from '@/services/genre.service';
import { toast } from 'sonner';

export default function Genres() {
  const {
    genres,
    loading,
    searchQuery,
    totalPages,
    page,
    setPage,
    orderBy,
    isAscending,
    handleOrderChange,
    totalElements
  } = useGenreQueries();

  const sortingOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'created-at', label: 'Data de Criação' },
  ];

  const handleClearCache = async () => {
    try {
      await GenreService.clearGenreCache();
      toast.success('Cache limpo com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Falha ao limpar cache');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Gêneros</h1>
            <p className="text-gray-600">Administre os gêneros literários da plataforma</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button 
              onClick={handleClearCache}
              variant="outline"
              className="gap-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
            >
              <i className="bi bi-trash3"></i>
              Limpar Cache
            </Button>

            <Select value={orderBy} onValueChange={handleOrderChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {orderBy === option.value && (
                        <span className="ml-2">
                          {isAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-full sm:w-auto">
              <CreateGenreModal />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {totalElements} {totalElements === 1 ? 'gênero' : 'gêneros'}
          </span>
          {searchQuery && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              Filtrado: {searchQuery}
            </span>
          )}
        </div>
      </header>

      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : genres.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-gray-500">Nenhum gênero encontrado</p>
            {!searchQuery && <CreateGenreModal />}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {genres.map((genre) => (
              <li key={genre.id}>
                <GenreCard genre={genre} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {totalPages > 1 && (
        <footer className="flex justify-center">
          <PaginationDemo 
            totalPages={totalPages} 
            page={page} 
            setPage={setPage} 
          />
        </footer>
      )}
    </main>
  );
}
