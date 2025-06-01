'use client';

import FilterBar from '@/components/program/filter-bar';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaginationDemo } from '@/components/program/pagination-demo';
import Book from '@/components/program/book';

import { useQueries } from '@/hooks/useQueries';
import CarouselBooks from '@/components/program/books-carousel';
import { SkeletonCard } from '@/components/program/skeleton-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown } from 'lucide-react';
import UserCard from '@/components/program/user-card';

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
    totalElements
  } = useQueries();

  const sortingOptions = {
    books: [
      { value: 'title', label: 'Título' },
      { value: 'author-name', label: 'Autor' },
      { value: 'published-at', label: 'Data de Publicação' },
      { value: 'page-count', label: 'Número de Páginas' }
    ],
    users: [
      { value: 'username', label: 'Nome de Usuário' },
      { value: 'created-at', label: 'Data de Registro' },
      { value: 'book-count', label: 'Livros Lidos' }
    ]
  };

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
              <p className="text-muted-foreground">
                {totalElements} {totalElements === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            </div>
            
            <nav>
              <RadioGroup 
                value={resourceType} 
                onValueChange={(value) => handleResourceTypeChange(value as 'books' | 'users')}
              >
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="books" id="r1" />
                    <Label htmlFor="r1">Livros</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="r2" />
                    <Label htmlFor="r2">Usuários</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={orderBy}
                      onValueChange={handleOrderChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`Ordenar por: ${orderBy ? sortingOptions[resourceType].find(o => o.value === orderBy)?.label : ''}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {sortingOptions[resourceType].map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex justify-between"
                          >
                            <span>{option.label}</span>
                            {orderBy === option.value && (
                              <span className="ml-2">
                                {isAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </RadioGroup>
            </nav>
          </header>

          {loading ? (
            <CarouselBooks
              books
              ={[...Array(5)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            />
          ) : resourceType === 'books' ? (
            books.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhum livro encontrado.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {books.map(book => (
                  <li key={book.id}>
                    <Book bookItem={book} isAdmin={false}/>
                  </li>
                ))}
              </ul>
            )
          ) : users.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {users.map(user => (
                <li key={user.id}>
                  <UserCard />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <PaginationDemo totalPages={totalPages} page={page} setPage={setPage} />
          )}
        </section>
      </div>
    </main>
  );
}