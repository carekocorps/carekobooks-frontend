'use client';

import FilterBar from '@/components/program/filter-bar';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PaginationDemo } from '@/components/program/pagination-demo';
import Book from '@/components/program/book';
import { useQueries } from '@/hooks/useQueries';
import CarouselBooks from '@/components/program/books-carousel';
import { SkeletonCard } from '@/components/program/skeleton-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SearchResultsPage() {
  const { books, loading, searchQuery, totalPages, page, setPage } = useQueries();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <FilterBar />
        </aside>

        <section className="md:w-3/4 p-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              {searchQuery && (
                <h1 className="text-2xl font-semibold">
                  Exibindo resultados para: <span className="text-primary">{searchQuery}</span>
                </h1>
              )}
              <p className="text-muted-foreground">{books.length} resultados encontrados</p>
            </div>
            
            <nav>
              <RadioGroup defaultValue="book">
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="book" id="r1" />
                    <Label htmlFor="r1">Livros</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="r2" />
                    <Label htmlFor="r2">Usuários</Label>
                  </div>

                  <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar Por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Username">Username</SelectItem>
                    <SelectItem value="Score">Score</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </RadioGroup>

            </nav>
            
          </header>

          {loading ? (
             <CarouselBooks
                books={[...Array(3)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
              />
          ) : books.length === 0 ? (
            <p>Nenhum livro encontrado.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
              {books.map(book => {
                return (
                  <div key={book.id}>
                    <Book bookItem={book} isAdmin={false}/>
                  </div>
                )
              })}
            </ul>
          )}

          <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
        </section>
      </div>
    </main>
  );
}