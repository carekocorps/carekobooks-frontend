"use client";

import Book from "@/components/program/book/book";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProgressStatus, useStatusProgresses } from "@/hooks/useStatusProgresses";
import { Frown, BookOpen, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PaginationDemo } from "@/components/program/pagination-demo";
import { SkeletonCard } from "@/components/program/book/skeleton-card";

export default function ViewUserBooks() {
  const [readStatus, setReadStatus] = useState<ProgressStatus>("READING");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const { 
    count, 
    progresses, 
    loading: progressLoading, 
    error: progressError,
    totalPages
  } = useStatusProgresses({
    username: user?.username,
    status: readStatus,
    page,
    perPage: itemsPerPage
  });

  const isLoading = userLoading || progressLoading;
  const error = userError || progressError;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="max-w-md text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-400/30">
          <Frown className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Erro ao carregar</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="max-w-md text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-400/30">
          <Bookmark className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Usuário não encontrado</h2>
          <p className="text-blue-600 dark:text-blue-200 mb-4">O perfil solicitado não está disponível</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

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