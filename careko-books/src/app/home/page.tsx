"use client";

import Banner from "@/components/program/banners";
import Activity from "@/components/program/activity";
import BookSection from "@/components/program/book/book-section";
import { useQueries } from "@/hooks/useQueries";
import { BookActivity, ActivityFilterParams } from "@/types/activity";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { ActivityService } from "@/services/activity.service";

export default function HomeContent() {
  const { books: recentBooks, loading } = useQueries({ 
    initialOrderBy: 'createdAt', 
    initialIsAscending: false 
  });
  const { books } = useQueries();
  
  const { user } = useCurrentUser();
  const [followedActivities, setFollowedActivities] = useState<BookActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [wsError, setWsError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const fetchInitialFeedActivities = async () => {
      try {
        setLoadingActivities(true);
        const params: ActivityFilterParams = {
          username: user.username,
          pageNumber: 0,
          pageSize: 10,
          orderBy: 'createdAt',
          isAscendingOrder: false
        };
        const response = await ActivityService.getFollowedFeedActivities(params);
        setFollowedActivities(response.content);
        setHasMore(!response.content.findLast);
        setWsError(null);
      } catch (error) {
        console.error("Error loading feed activities:", error);
        setWsError("Erro ao carregar atividades");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchInitialFeedActivities();

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isMounted = true;

    const connect = () => {
      try {
        ws = ActivityService.connectWebSocket(
          user.username,
          (newActivity) => {
            if (isMounted) {
              setFollowedActivities(prev => {
                const exists = prev.some(a => a.id === newActivity.id);
                if (exists) return prev;
                const updated = [newActivity, ...prev].slice(0, 10);
  
                queryClient.setQueryData(['followedActivities', user.username], updated);
                return updated;
              });
            }
          }
        );

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          if (isMounted) {
            setWsError("Conexão perdida, tentando reconectar...");
          }
          scheduleReconnect();
        };

        ws.onclose = (event) => {
          if (event.code !== 1000 && isMounted) {
            console.log("WebSocket fechado, tentando reconectar...");
            scheduleReconnect();
          }
        };
      } catch (error) {
        console.error("WebSocket setup error:", error);
        if (isMounted) {
          setWsError("Erro ao conectar com atualizações em tempo real");
        }
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (isMounted) {
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      
      if (ws) {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            const unsubscribeMessage = JSON.stringify({
              type: "unsubscribe",
              topic: `/topic/users/${user.username}/social/feed`
            });
            ws.send(unsubscribeMessage);
          }
          ws.close(1000, "Component unmounted");
        } catch (error) {
          console.error("Error closing WebSocket:", error);
        }
      }
    };
  }, [user?.username, queryClient]);

  const loadMoreActivities = async () => {
    if (!user || !hasMore || loadingActivities) return;
    
    try {
      setLoadingActivities(true);
      const nextPage = page + 1;
      const params: ActivityFilterParams = {
        username: user.username,
        pageNumber: nextPage,
        pageSize: 10,
        orderBy: 'createdAt',
        isAscendingOrder: false
      };
      const response = await ActivityService.getFollowedFeedActivities(params);
      setFollowedActivities(prev => [...prev, ...response.content]);
      setPage(nextPage);
      setHasMore(!response.content.findLast);
    } catch (error) {
      console.error("Error loading more activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  return (
    <section className="flex flex-col w-full mt-8 gap-12 px-5 sm:px-2 max-w-7xl mx-auto">
      <div className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Banner 
          image1="/distopia.png" 
          image2="/ad.png" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-100">
            <BookSection 
              title="Popular na sua rede" 
              iconClass="bi bi-bar-chart-fill text-indigo-500" 
              books={books} 
              loading={loading} 
            />
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-teal-100">
            <BookSection 
              title="Continue Lendo" 
              iconClass="bi bi-book-half text-teal-500" 
              books={books} 
              loading={loading} 
            />
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-amber-100">
            <BookSection 
              title="Livros mais recentes" 
              iconClass="bi bi-clock-history text-amber-400" 
              books={recentBooks} 
              loading={loading} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 sticky top-6 h-fit w-full lg:w-[300px]">
          <div className="bg-gradient-to-b from-white to-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-50 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-inner">
                <i className="bi bi-activity text-indigo-600 text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Atividades dos Seguidos
              </h2>
            </div>
            
            {wsError && (
              <div className="mb-4 p-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm flex items-center">
                <i className="bi bi-exclamation-triangle mr-2"></i>
                {wsError}
              </div>
            )}
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {loadingActivities && page === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-full bg-white/80 dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 animate-pulse">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))
              ) : followedActivities.length > 0 ? (
                followedActivities.map(activity => (
                  <Activity 
                    key={activity.id} 
                    activity={activity}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Nenhuma atividade recente dos seus seguidos</p>
                  <p className="text-sm mt-2">
                    Comece a seguir outros usuários para ver suas atividades aqui
                  </p>
                </div>
              )}
            </div>

            {hasMore && followedActivities.length > 0 && (
              <button 
                className="mt-4 w-full py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-2 border border-gray-200 rounded-lg transition-colors hover:border-indigo-300 bg-white"
                onClick={loadMoreActivities}
                disabled={loadingActivities}
              >
                {loadingActivities ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600 mr-2"></span>
                    Carregando...
                  </span>
                ) : (
                  <>
                    Mostrar mais
                    <i className="bi bi-chevron-down text-xs"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}