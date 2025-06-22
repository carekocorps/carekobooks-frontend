"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import GenreCard from "@/components/program/genre/genre-card";
import { PaginationDemo } from "@/components/program/pagination-demo";
import { useGenreQueries } from "@/hooks/useGenreQueries";
import CreateGenreModal from "@/components/program/genre/create-genre-modal";
import { Button } from "@/components/ui/button";
import { GenreService } from "@/services/genre.service";
import { toast } from "sonner";
import { SkeletonGenreCard } from "@/components/program/genre/skeleton-genre";

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
    totalElements,
  } = useGenreQueries();

  const sortingOptions = [
    { value: "name", label: "Nome" },
    { value: "created-at", label: "Data de Criação" },
  ];

  const handleClearCache = async () => {
    try {
      await GenreService.clearGenreCache();
      toast.success("Cache limpo com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast.error("Falha ao limpar cache");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Gêneros
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administre os gêneros literários da plataforma
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={handleClearCache}
              variant="outline"
              className={`
                gap-2 border-red-600 text-red-600
                hover:bg-red-50 hover:text-red-700
                dark:border-red-500 dark:text-red-500
                dark:hover:bg-red-900 dark:hover:text-red-300
                w-full sm:w-auto
              `}
            >
              <i className="bi bi-trash3" />
              Limpar Cache
            </Button>

            <Select value={orderBy} onValueChange={handleOrderChange}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
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

            <div className="w-full sm:w-auto">
              <CreateGenreModal />
            </div>
          </div>
        </div>

        {/* Resumo e filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded-full">
            {totalElements} {totalElements === 1 ? "gênero" : "gêneros"}
          </span>
          {searchQuery && (
            <span className="text-sm bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80 px-3 py-1 rounded-full">
              Filtrado: {searchQuery}
            </span>
          )}
        </div>
      </header>

      {/* Lista de gêneros */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <SkeletonGenreCard key={idx} />
            ))}
          </div>
        ) : genres.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum gênero encontrado
            </p>
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

      {/* Paginação */}
      {totalPages > 1 && (
        <footer className="flex justify-center">
          <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
        </footer>
      )}
    </main>
  );
}
