"use client";

import { BookOpen } from "lucide-react";
import Book from "@/components/program/book/book";
import { useQueries } from "@/hooks/useQueries";
import { SkeletonCard } from "@/components/program/book/skeleton-card";
import { BookType } from "@/types/book";

export default function TrendingBooks() {
  const { books: trendingBooks, loading } = useQueries({
    initialPageSize: 3,
    initialOrderBy: "userAverageScore",
    initialIsAscending: false, 
  });

  return (
    <section className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-rose-500" size={20} />
        <h3 className="text-lg font-bold">Mais bem Avaliados nesta págin</h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow animate-pulse">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {trendingBooks.map((book: BookType) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow"
            >
              <Book bookItem={book} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
