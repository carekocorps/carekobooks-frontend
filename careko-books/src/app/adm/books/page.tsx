"use client";

import { ArrowUp, ArrowDown, Search } from "lucide-react";
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
import CreateBookModal from "@/components/program/book/create-book-modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookService } from "@/services/books.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    handleOrderChange,
  } = useQueries({
    initialPageSize: 14,
    initialOrderBy: "title",
  });

  const { user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.roles?.includes("ADMIN")) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const sortingOptions = [
    { value: "title", label: "Título" },
    { value: "authorName", label: "Autor" },
    { value: "publishedAt", label: "Data de Criação" },
  ];

  const handleClearCache = async () => {
    try {
      await BookService.clearBookCache();
      toast.success("Cache limpo com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast.error("Falha ao limpar cache");
    }
  };

  return (
    
    <main className="container mx-auto px-4 py-8 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="space-y-6">
        {/* Título e ações */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Livros
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administre o acervo literário da plataforma
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={handleClearCache}
              variant="outline"
              className="
                gap-2 border-red-600 text-red-600
                hover:bg-red-50 hover:text-red-700
                dark:border-red-500 dark:text-red-500
                dark:hover:bg-red-900 dark:hover:text-red-300
                w-full sm:w-auto
              "
            >
              <i className="bi bi-trash3" />
              Limpar Cache
            </Button>

            <Select value={orderBy} onValueChange={handleOrderChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {sortingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {orderBy === option.value && (
                        <span className="ml-2">
                          {isAscending ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )}
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

        {/* Resumo e Filtros Ativos */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded-full">
            {totalElements} {totalElements === 1 ? "livro" : "livros"}
          </span>
          {searchQuery && (
            <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-3 py-1 rounded-full">
              Filtrado: {searchQuery}
            </span>
          )}
        </div>

        {/* Campo de busca */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Pesquisar livros..."
            className="pl-10 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            defaultValue={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                if (value) url.searchParams.set("search", value);
                else url.searchParams.delete("search");
                window.history.pushState({}, "", url.toString());
              }
            }}
          />
        </div>
      </header>

      {/* Seção de Livros */}
      <section aria-live="polite" aria-busy={loading}>
        {loading ? (
          <CarouselBooks
            books={[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          />
        ) : books.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum livro encontrado
            </p>
            {!searchQuery && <CreateBookModal />}
          </div>
        ) : (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4"
            role="list"
          >
            {books.map((book) => (
              <li key={book.id}>
                <Book bookItem={book} isAdmin />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Paginação */}
      {totalPages > 1 && (
        <nav
          aria-label="Paginação"
          className="flex justify-center pt-4"
        >
          <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
        </nav>
      )}
    </main>
  );
}
