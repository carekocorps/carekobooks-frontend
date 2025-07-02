"use client";

import Book from "@/components/program/book/book";
import { ProgressStatus, useStatusProgresses } from "@/hooks/useStatusProgresses";
import { BookOpen, Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PaginationDemo } from "@/components/program/utils/pagination-demo";

interface ProgressTableProps {
  username: string;
}

export default function ViewProgressTable({ username }: ProgressTableProps) {
  const [viewStatus, setViewStatus] = useState<ProgressStatus>("READING");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { count, progresses, totalPages } = useStatusProgresses({
    username: username,
    status: viewStatus,
    page,
    perPage: itemsPerPage
  });

  const statusTitles = {
    READING: "em Leitura",
    PLANS_TO_READ: "Quero Ler",
    FINISHED: "Lidos",
    FAVORITES: "Favoritos"
  };

  const statusToTabValue = {
    READING: "reading",
    PLANS_TO_READ: "want",
    FINISHED: "finished",
    FAVORITES: "favorites"
  };

  const tabValueToStatus = {
    reading: "READING",
    want: "PLANS_TO_READ",
    finished: "FINISHED",
    favorites: "FAVORITES"
  } as const;

  return (
    <main className="max-w-5xl mx-auto px-10 py-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl relative overflow-visible flex flex-col items-center border border-gray-100 dark:border-gray-800 ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white items-start">
            Livros {statusTitles[viewStatus]}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {count > 0
              ? `${count} livro${count > 1 ? 's' : ''} encontrado${count > 1 ? 's' : ''}`
              : 'Nenhum livro encontrado'}
          </p>
        </div>
      </div>

      <Tabs
        value={statusToTabValue[viewStatus]}
        onValueChange={(value: string) => {
          if (value in tabValueToStatus) {
            setViewStatus(tabValueToStatus[value as keyof typeof tabValueToStatus]);
            setPage(1);
          }
        }}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-md bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="reading"
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            Lendo
          </TabsTrigger>
          <TabsTrigger
            value="want"
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            Quero Ler
          </TabsTrigger>
          <TabsTrigger
            value="finished"
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            Lidos
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white flex items-center gap-1"
          >
             Favoritos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {progresses?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
            {progresses.map(progress => (
              <Book 
                key={progress.id} 
                bookItem={progress.book} 
                isProgress={true} 
                score={progress.score}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationDemo
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 p-20 border-2 border-dashed rounded-2xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
          {viewStatus === "FAVORITES" ? (
            <Heart className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          ) : (
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          )}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {viewStatus === "FAVORITES" 
              ? "Nenhum livro favoritado" 
              : "Nenhum livro encontrado"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            {viewStatus === "FAVORITES"
              ? "Este usuário ainda não favoritou nenhum livro!"
              : "Este usuário não realizou progresso nesta secção!"}
          </p>
        </div>
      )}
    </main>
  );
}