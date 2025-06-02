'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationDemo } from '@/components/program/pagination-demo';
import Book from '@/components/program/book/book';
import { useQueries } from '@/hooks/useQueries';
import CarouselBooks from '@/components/program/book/books-carousel';
import { SkeletonCard } from '@/components/program/skeleton-card';
import CreateBookModal from '@/components/program/book/create-book-modal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { GenreService } from '@/services/genre.service';
import { BookService } from '@/services/books.service';

export default function Books() {
  const {
    books,
    loading,
    searchQuery,
    totalPages,
    page,
    setPage,
    totalElements,
    orderBy,
    isAscending,
    handleOrderChange
  } = useQueries({ 
    initialPageSize: 14,
    initialOrderBy: 'title'
  });

  const sortingOptions = [
    { value: 'title', label: 'Título' },
    { value: 'author', label: 'Autor' },
    { value: 'published-at', label: 'Data de Criação' },
  ];

  const handleClearCache = async () => {
    try {
      await BookService.clearBookCache();
      toast.success('Cache limpo com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Falha ao limpar cache');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Livros</h1>
            <p className="text-gray-600">Administre o acervo literário da plataforma</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <Button 
              onClick={handleClearCache}
              variant="outline"
              className="gap-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <i className="bi bi-trash3"></i>
              Limpar Cache
            </Button>

            <Select value={orderBy} onValueChange={handleOrderChange}>
              <SelectTrigger className="w-[180px]">
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
            
            <CreateBookModal />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {totalElements} {totalElements === 1 ? 'livro' : 'livros'}
          </span>
          {searchQuery && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              Filtrado: "{searchQuery}"
            </span>
          )}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar livros..."
            className="pl-10 w-full"
            defaultValue={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                if (value) {
                  url.searchParams.set('search', value);
                } else {
                  url.searchParams.delete('search');
                }
                window.history.pushState({}, '', url.toString());
              }
            }}
          />
        </div>
      </header>

      <section aria-live="polite" aria-busy={loading}>
        {loading ? (
          <CarouselBooks
            books={[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          />
        ) : books.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-gray-500">Nenhum livro encontrado</p>
            {!searchQuery && <CreateBookModal />}
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4" role="list">
            {books.map((book) => (
              <li key={book.id}>
                <Book bookItem={book} isAdmin={true} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="flex justify-center">
          <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
        </nav>
      )}
    </main>
  );
}