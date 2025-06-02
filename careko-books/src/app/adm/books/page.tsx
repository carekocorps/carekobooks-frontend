'use client';

import { PaginationDemo } from '@/components/program/pagination-demo';
import Book from '@/components/program/book';
import { useQueries } from '@/hooks/useQueries';
import CarouselBooks from '@/components/program/books-carousel';
import { SkeletonCard } from '@/components/program/skeleton-card';
import SearchBar from '@/components/program/search-bar';
import CreateBookModal from '@/components/program/create-book-modal'; 

export default function Books() {
  const { books, loading, searchQuery, totalPages, page, setPage } = useQueries({ initialPageSize: 14 });

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col gap-10">
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Área do Administrador - Livros</h1>
          <p className="text-md text-gray-500">Cadastre, edite e exclua livros dentro da plataforma.</p>
        </div>

        <CreateBookModal />
      </header>

      <div>
        <SearchBar/>
      </div>

      <section aria-live="polite" aria-busy={loading}>
        {loading ? (
          <CarouselBooks
            books={[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          />
        ) : books.length === 0 ? (
          <p>Nenhum livro encontrado.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-1" role="list">
            {books.map((book) => (
              <li key={book.id}>
                <Book bookItem={book} isAdmin={true} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label="Paginação dos livros">
        <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
      </nav>
    </main>
  );
}
