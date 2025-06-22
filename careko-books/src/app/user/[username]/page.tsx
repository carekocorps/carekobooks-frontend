"use client";

import { useState, useEffect, useRef } from "react";
import Activity from "@/components/program/activity";
import FollowModal from "@/components/program/follow-modal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser"; 

import { UserType } from "@/types/user";
import { BookActivity } from "@/types/activity"; 

import { UserService } from "@/services/user.services";
import { UserSocialService } from "@/services/userSocial.service";

export default function ViewOtherUserProfile() {
  const params = useParams();
  const username = params.username as string;
  const currentUser = useCurrentUser().user; 

  const [user, setUser] = useState<UserType | null>(null);
  const [activities, setActivities] = useState<BookActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<"seguidores" | "seguindo" | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await UserService.getUserByUsername(username);
        setUser(userData);

        if (currentUser?.username !== username) {
          const response = await UserSocialService.getFollowing(currentUser?.username ?? "", { pageSize: 100 });
          const seguidos = response.data.content;
          const segue = seguidos.some((u: any) => u.username === username);
          setIsFollowing(segue);
        }

        setError(null);
      } catch (err) {
        setError("Usuário não encontrado");
      } finally {
        setLoading(false);
      }
    };

    if (username && currentUser) {
      fetchUserData();
    }
  }, [username, currentUser]);

  useEffect(() => {
    if (!modalOpen || !username) return;

    const fetchFollowData = async () => {
      try {
        const response = modalOpen === "seguidores" 
          ? await UserSocialService.getFollowers(username, { pageSize: 100 }) 
          : await UserSocialService.getFollowing(username, { pageSize: 100 });

        const data = response.data.content; 

        if (modalOpen === "seguidores") {
          setFollowers(data);
        } else {
          setFollowing(data);
        }
      } catch (error) {
        console.error(`Erro ao carregar ${modalOpen}:`, error);
      }
    };

    fetchFollowData();
  }, [modalOpen, username]);

  const handleOpen = (tab: "seguidores" | "seguindo") => {
    setModalOpen(tab);
  };

  const handleClose = () => {
    setModalOpen(null);
  };

  const handleFollow = async () => {
    if (!user || loadingFollow || !currentUser) return;

    try {
      setLoadingFollow(true);
      if (isFollowing) {
        await UserSocialService.unfollowUser(currentUser.username, user.username);
      } else {
        await UserSocialService.followUser(currentUser.username, user.username);
      }
      setIsFollowing(!isFollowing);

      setUser({
        ...user,
        followersCount: isFollowing 
          ? user.followersCount - 1 
          : user.followersCount + 1
      });
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="flex justify-center gap-6 mt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
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
          <Button 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
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
                alt={`Avatar de ${user.displayName}`}
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
                <button 
                  onClick={() => handleOpen("seguidores")}
                  className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="font-bold text-gray-900 dark:text-white">{user.followersCount}</span>
                  <span>Seguidores</span>
                </button>
                <button 
                  onClick={() => handleOpen("seguindo")}
                  className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="font-bold text-gray-900 dark:text-white">{user.followingCount}</span>
                  <span>Seguindo</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-gray-900 dark:text-white">{user.progressesCount}</span>
                  <span>Progressos</span>
                </div>
              </div>

              {currentUser?.username !== user.username && (
                <div className="w-full max-w-xs">
                  <Button
                    className={`w-full ${isFollowing 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleFollow}
                    disabled={loadingFollow}
                  >
                    {loadingFollow ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Carregando...
                      </span>
                    ) : isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                </div>
              )}
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
              {activities.length > 0 ? (
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

      {modalOpen && (
        <FollowModal
          activeTab={modalOpen}
          onCloseAction={handleClose}
          followers={followers}
          following={following}
        />
      )}
    </main>
  );
}
