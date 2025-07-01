"use client";

import { ArrowUp, ArrowDown, Star, BookOpen, Flame } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationDemo } from "@/components/program/utils/pagination-demo";
import Book from "@/components/program/book/book";
import { useQueries } from "@/hooks/useQueries";
import CarouselBooks from "@/components/program/book/books-carousel";
import { SkeletonCard } from "@/components/program/book/skeleton-card";
import { useState, useEffect } from "react";
import { BookType } from "@/types/book";
import { BookService } from "@/services/books.service";

export default function ExploreBooks() {
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
    handleOrderChange,
  } = useQueries({
    initialPageSize: 15,
    initialOrderBy: "title",
  });

  const [featuredBooks, setFeaturedBooks] = useState<BookType[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const fetchTopBooks = async () => {
      setLoadingTop(true);
      try {
        const response = await BookService.getBooks(
          1, 
          3, 
          '', 
          'userAverageScore', 
          false 
        );
        setFeaturedBooks(response.data.content);
      } catch (error) {
        console.error("Erro ao buscar livros em destaque:", error);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopBooks();
  }, []);

  const top3ThisPage = [...books]
    .filter(book => book.userAverageScore !== undefined)
    .sort((a, b) => (b.userAverageScore ?? 0) - (a.userAverageScore ?? 0))
    .slice(0, 3);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Livros em Alta</h2>
        </div>
        
        {loadingTop ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
                <Book bookItem={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Todos os Livros</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
                <span className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded-full">
                  {totalElements} {totalElements === 1 ? "livro" : "livros"}
                </span>
                {searchQuery && (
                  <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-3 py-1 rounded-full">
                    Filtrado: {searchQuery}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={orderBy} onValueChange={handleOrderChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="authorName">Autor</SelectItem>
                  <SelectItem value="publishedAt">Mais Antigos</SelectItem>
                  <SelectItem value="userAverageScore">Melhor Avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {top3ThisPage.length > 0 && (
            <section className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-amber-500 fill-amber-500" size={20} />
                <h3 className="text-lg font-bold">Top 3 desta página</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3ThisPage.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md transform transition-transform hover:scale-[1.02]"
                  >
                    <Book bookItem={book} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section aria-live="polite" aria-busy={loading}>
            {loading ? (
              <CarouselBooks
                books={[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              />
            ) : books.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum livro encontrado!
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6" role="list">
                {books.map((book) => (
                  <li key={book.id} className="transform transition-transform hover:scale-[1.03]">
                    <Book bookItem={book} />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav aria-label="Paginação" className="flex justify-center pt-8">
                <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}