"use client";

import { useEffect, useState, useRef } from "react";
import Activity from "@/components/program/activity";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityService } from "@/services/activity.service";
import { BookActivity } from "@/types/activity";

export default function ViewUserProfile() {
  const { user, loading, error } = useCurrentUser();
  const [activities, setActivities] = useState<BookActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchInitialActivities = async () => {
      try {
        setLoadingActivities(true);
        const response = await ActivityService.getActivities({
          username: user.username,
          pageSize: 10,
          orderBy: "createdAt",
          isAscendingOrder: false
        });
        setActivities(response.content);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchInitialActivities();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-[250px] mx-auto" />
          <Skeleton className="h-4 w-[200px] mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 bg-red-50 p-6 rounded-xl max-w-md text-center">
          <h2 className="font-bold text-lg mb-2">Erro ao carregar perfil</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-blue-50 text-blue-800 p-6 rounded-xl max-w-md text-center">
          <h2 className="font-bold text-lg mb-2">Usuário não encontrado</h2>
          <p>O perfil solicitado não está disponível</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 mx-auto flex justify-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 mt-8 justify-center">
        <div className="bg-white dark:bg-gray-900 shadow-lg w-full lg:w-2/5 rounded-2xl relative overflow-visible flex flex-col items-center gap-5 pt-24 pb-8 px-6 border border-gray-100 dark:border-gray-800 mx-auto">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 shadow-lg">
              <AvatarImage
                src={user.image?.url || "/default-avatar.png"}
                alt="Imagem de avatar"
                className="object-cover w-full h-full"
              />
            </Avatar>
          </div>

          <div className="flex flex-col w-full gap-6 mt-4 items-center">
            <div className="flex flex-col items-center w-full gap-4">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {user.displayName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
              </div>

              <div className="flex justify-center gap-6 w-full text-sm text-gray-600 dark:text-gray-300">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-gray-900 dark:text-white">{user.followersCount}</span>
                  <span>Seguidores</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-gray-900 dark:text-white">{user.followingCount}</span>
                  <span>Seguindo</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-gray-900 dark:text-white">{user.progressesCount}</span>
                  <span>Progressos</span>
                </div>
              </div>

              <div className="flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
                <Button variant="outline" className="w-full">Configurações</Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Editar Perfil</Button>
              </div>
            </div>

            <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
              <p className="text-gray-700 dark:text-gray-300">
                {user.description || "Este usuário ainda não adicionou uma descrição."}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5 space-y-6 mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-2xl p-6">
            <h1 className="text-white text-2xl font-bold mb-6 text-center">
              Mural de Atividades
            </h1>

            <div className="space-y-4 max-h-[500px] overflow-y-auto px-2">
              {loadingActivities ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-full bg-white/80 dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 animate-pulse mx-auto">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map(activity => (
                  <div key={activity.id} className="mx-auto">
                    <Activity activity={activity} />
                  </div>
                ))
              ) : (
                <div className="w-full bg-white/80 dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 text-center mx-auto">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma atividade recente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}