"use client"

import { GenrePieChart } from "@/components/program/dashboard/chart-pie";
import { StatCard } from "@/components/program/dashboard/dash-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useStatusProgresses } from "@/hooks/useStatusProgresses";

export default function ViewDashboard(){
    const { user, loading, error } = useCurrentUser();
    const { count: finishedCount } = 
    useStatusProgresses({ username: user?.username, status: "FINISHED" });
    const { count: readingCount } = 
    useStatusProgresses({ username: user?.username, status: "READING" });
    const { count: plansCount  } = 
    useStatusProgresses({ username: user?.username, status: "PLANS_TO_READ" });

    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-12 w-12 rounded-full mx-auto bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-64 mx-auto bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-48 mx-auto bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl max-w-md text-center border border-red-200 dark:border-red-800/50">
          <h2 className="font-bold text-lg mb-2 text-red-800 dark:text-red-300">Erro ao carregar dashboard</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl max-w-md text-center border border-blue-200 dark:border-blue-800/50">
          <h2 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-300">Usuário não encontrado</h2>
          <p className="text-blue-600 dark:text-blue-400">O perfil solicitado não está disponível</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full mt-8 gap-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="w-full max-w-6xl flex flex-col justify-start">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Olá, <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.username}</span>
        </h1>
        <h2 className="text-lg text-gray-600 dark:text-gray-400 mt-1">
          Seja bem-vindo ao seu Dashboard pessoal!
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
          <div className="p-3">
            <StatCard 
              count={user.progressesCount} 
              label="Progressos iniciados"
              icon={
                <i className="bi bi-journal-bookmark text-indigo-600 dark:text-indigo-400 text-2xl" />
              }
            />
          </div>

          <div className="p-3">
            <StatCard 
              count={finishedCount} 
              label="Livros terminados"
              icon={
                <i className="bi bi-check-circle text-green-600 dark:text-green-400 text-2xl" />
              }
            />
          </div>

          <div className="p-3">
            <StatCard 
              count={readingCount} 
              label="Estou lendo"
              icon={
                <i className="bi bi-book-half text-blue-600 dark:text-blue-400 text-2xl" />
              }
            />
          </div>

          <div className="p-3">
            <StatCard 
              count={plansCount} 
              label="Planejo ler"
              icon={
                <i className="bi bi-bookmarks text-amber-600 dark:text-amber-400 text-2xl" />
              }
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <GenrePieChart username={user?.username} />
        </div>
      </div>
    </main>
  )
}