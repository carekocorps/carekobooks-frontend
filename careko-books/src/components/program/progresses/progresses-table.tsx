"use client";

import Book from "@/components/program/book/book";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProgressStatus, useStatusProgresses } from "@/hooks/useStatusProgresses";
import { Frown, BookOpen, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PaginationDemo } from "@/components/program/utils/pagination-demo";
import { SkeletonCard } from "@/components/program/book/skeleton-card";

interface UserBooksProps {
    username: string;
}

export default function ViewUserBooks({ username } : UserBooksProps) {
  const [readStatus, setReadStatus] = useState<ProgressStatus>("READING");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const { 
    count, 
    progresses, 
    loading: progressLoading, 
    error: progressError,
    totalPages
  } = useStatusProgresses({
    username: username,
    status: readStatus,
    page,
    perPage: itemsPerPage
  });

  const statusTitles = {
    READING: "em Leitura",
    PLANS_TO_READ: "Quero Ler",
    FINISHED: "Lidos"
  };

  return(
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Livros {statusTitles[readStatus]}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {count > 0 
              ? `${count} livro${count > 1 ? 's' : ''} encontrado${count > 1 ? 's' : ''}` 
              : 'Nenhum livro encontrado'}
          </p>
        </div>
      </div>

      <Tabs
        value={readStatus.toLowerCase()}
        onValueChange={(value) => {
          if (value === "reading") setReadStatus("READING");
          if (value === "want") setReadStatus("PLANS_TO_READ");
          if (value === "finished") setReadStatus("FINISHED");
          setPage(1);
        }}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-xs bg-gray-100 dark:bg-gray-800">
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
        </TabsList>
      </Tabs>

      {progresses?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
            {progresses.map(progress => (
              <Book 
                key={progress.id} 
                bookItem={progress.book} 
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
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            {readStatus === "READING"
              ? "Você ainda não começou a ler nenhum livro. Explore nossa biblioteca!"
              : readStatus === "PLANS_TO_READ"
              ? "Sua lista de desejos está vazia. Adicione livros que deseja ler!"
              : "Você ainda não completou nenhuma leitura. Continue explorando!"}
          </p>
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
            Explorar Biblioteca
          </button>
        </div>
      )}
    </main>
  )
}