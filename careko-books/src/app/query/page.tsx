"use client";

import FilterBar from "@/components/program/filter-bar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaginationDemo } from "@/components/program/pagination-demo";
import Book from "@/components/program/book/book";
import { useQueries } from "@/hooks/useQueries";
import CarouselBooks from "@/components/program/book/books-carousel";
import { SkeletonCard } from "@/components/program/book/skeleton-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";
import UserCard from "@/components/program/user/user-card";
import { useQueryState } from "nuqs";

export default function SearchResultsPage() {
  const {
    books,
    users,
    loading,
    searchQuery,
    totalPages,
    page,
    setPage,
    orderBy,
    isAscending,
    handleOrderChange,
    resourceType,
    handleResourceTypeChange,
    totalElements,
  } = useQueries();

  const sortingOptions = {
    books: [
      { value: "title", label: "Título" },
      { value: "author-name", label: "Autor" },
      { value: "published-at", label: "Data de Publicação" },
      { value: "page-count", label: "Número de Páginas" },
    ],
    users: [
      { value: "username", label: "Nome de Usuário" },
      { value: "published-at", label: "Data de Registro" },
    ],
  };

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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-muted rounded-2xl p-4 shadow-sm h-fit">
          <FilterBar 
            resourceType={resourceType}
            filters={filters}
            setFilters={setFilters}
          />
        </aside>

        <section>
          <header className="mb-6">
            {searchQuery && (
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Resultados para:{" "}
                <span className="text-primary">{searchQuery}</span>
              </h1>
            )}
            <p className="text-muted-foreground text-sm">
              {totalElements}{" "}
              {totalElements === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </header>

          <div className="bg-background border rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <RadioGroup
              value={resourceType}
              onValueChange={(value) =>
                handleResourceTypeChange(value as "books" | "users")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="books" id="r1" />
                <Label htmlFor="r1">Livros</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="users" id="r2" />
                <Label htmlFor="r2">Usuários</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={orderBy} onValueChange={handleOrderChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue
                    placeholder={`Ordenar por: ${
                      orderBy
                        ? sortingOptions[resourceType].find((o) => o.value === orderBy)
                            ?.label
                        : ""
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {sortingOptions[resourceType].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
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
            </div>
          </div>

          <div className="min-h-[300px]">
            {loading ? (
              <CarouselBooks
                books={[...Array(5)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              />
            ) : resourceType === "books" ? (
              books.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Nenhum livro encontrado.
                </p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {books.map((book) => (
                    <li key={book.id}>
                      <Book bookItem={book} isAdmin={false} />
                    </li>
                  ))}
                </ul>
              )
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Nenhum usuário encontrado.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {users.map((user) => (
                  <li key={user.id}>
                    <UserCard user={user} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}