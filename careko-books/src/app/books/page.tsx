'use client';

import React from 'react'
import FilterBar from '@/components/program/filter-bar';
import { useSearchParams } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import CarouselBooks from "@/components/program/books-carousel";
import Book from "@/components/program/book";
import { PaginationDemo } from '@/components/program/pagination-demo';

type BookItem = {
  id: string;
  image: string;
  name: string;
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  const booksData: BookItem[] = [
    { id: "1", image: "/booksMock/metamorfose.png", name: "A Metamorfose" },
    { id: "2", image: "/image.png", name: "Biriba" },
    { id: "3", image: "/booksMock/larissa.png", name: "O Diário de Larissa Manoela" },
    { id: "4", image: "/booksMock/rezende.png", name: "Dois Mundos, Um Herói" },
    { id: "5", image: "/booksMock/assim.png", name: "É Assim que Acaba" },
    { id: "6", image: "/booksMock/sapiens.png", name: "Sapiens" },
  ];

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
              <p className="text-muted-foreground">1 de 35</p>
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
                </div>
              </RadioGroup>
            </nav>
            
          </header>
          
          <article>
            <h2 className="sr-only">Livros encontrados</h2>
            <CarouselBooks
              books={booksData.map(book => (
                <Book 
                  key={book.id} 
                  image={book.image} 
                  name={book.name} 
                />
              ))}
            />
            <h2 className="sr-only">Livros encontrados</h2>
            <CarouselBooks
              books={booksData.map(book => (
                <Book 
                  key={book.id} 
                  image={book.image} 
                  name={book.name} 
                />
              ))}
            />
          </article>

          <PaginationDemo />
        </section>
      </div>
    </main>
  );
}
