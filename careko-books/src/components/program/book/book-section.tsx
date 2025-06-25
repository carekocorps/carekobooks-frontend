"use client";

import { BookType } from "@/types/book";
import CarouselBooks from "@/components/program/book/books-carousel";
import { Separator } from "@/components/ui/separator";
import Book from "@/components/program/book/book";
import { SkeletonCard } from "./skeleton-card";
import { BookOpen } from "lucide-react";

type Props = {
  title: string;
  iconClass: string;
  books: BookType[];
  loading: boolean;
};

export default function BookSection({ title, iconClass, books, loading }: Props) {
  return (
    <div className="w-218">
      <h1 className="text-2xl text-gray-800 dark:text-gray-100 flex items-center gap-4">
        <i className={iconClass} />
        {title}
      </h1>
      <Separator orientation="horizontal" className="h-px bg-gray-300 dark:bg-gray-600" />

      {loading ? (
        <CarouselBooks
          books={[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        />
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 p-6 border-2 border-dashed rounded-2xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 mt-4">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Não há livros para mostrar nesta seção.
          </p>
        </div>
      ) : (
        <ul className="gap-1">
          <CarouselBooks
            books={books.map((book) => (
              <Book key={book.id} bookItem={book} />
            ))}
          />
        </ul>
      )}
    </div>
  );
}