"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserType } from "@/types/user";
import { BookActivity } from "@/types/activity";
import { UserService } from "@/services/user.services";
import { UserSocialService } from "@/services/userSocial.service";
import { ActivityService } from "@/services/activity.service";
import ProfileHeader from "@/components/program/user/profile-header";
import LoadingState from "@/components/program/utils/loading-state";
import ErrorState from "@/components/program/utils/error-state";
import UserNotFoundState from "@/components/program/utils/user-not-found";
import ActivityFeed from "@/components/program/activity/activity-feed";
import FollowModal from "@/components/program/user/follow-modal";
import ViewProgressTable from "@/components/program/progresses/progresses-table";
import { toast } from "sonner";

export default function ViewUserProfile() {
  const params = useParams();
  const username = params.username as string;
  const currentUser = useCurrentUser().user;

  const [user, setUser] = useState<UserType | null>(null);
  const [activities, setActivities] = useState<BookActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<"seguidores" | "seguindo" | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);

  const isCurrentUserProfile = currentUser?.username === username;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getUserByUsername(username);
      setUser(userData);

      if (!isCurrentUserProfile) {
        const response = await UserSocialService.getFollowing(currentUser?.username ?? "", { pageSize: 100 });
        const seguidos = response.data.content;
        const segue = seguidos.some((u: UserType) => u.username === username);
        setIsFollowing(segue);
      }

      setError(null);
    } catch (err) {
      console.log(err);
      setError("Usuário não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdated = () => {
    fetchUserData();
  };

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

  const fetchActivities = async () => {
    if (!user) return;
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

  const handleDeleteActivity = async (activityId: number) => {
    setDeletingId(activityId);
    try {
      await ActivityService.deleteActivity(activityId);
      setActivities(prev => prev.filter(a => a.id !== activityId));
      toast.success("Atividade removida com sucesso");
    } catch (error: unknown) {
      if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: unknown }).response === "object" &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        const message = (error as { response: { data: { message: string } } }).response.data.message;
        toast.error(message);
      } else {
        toast.error("Erro desconhecido ao remover atividade");
      }
      await fetchActivities();
    } finally {
      setDeletingId(null);
    }
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

  useEffect(() => {
    if (username && currentUser) {
      fetchUserData();
    }
  }, [username, currentUser]);

  useEffect(() => {
    if (!modalOpen || !username) return;
    fetchFollowData();
  }, [modalOpen, username]);

  useEffect(() => {
    if (!user) return;
    fetchActivities();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  const handleOpenFollowers = () => setModalOpen("seguidores");
  const handleOpenFollowing = () => setModalOpen("seguindo");
  const handleCloseModal = () => setModalOpen(null);
  const handleRetry = () => window.location.reload();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={handleRetry} />;
  if (!user) return <UserNotFoundState />;

  return (
      <main className="p-4 md:p-8 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8 justify-center">
          <div className="flex flex-col w-full lg:w-2/5">
            <ProfileHeader
                user={user}
                isCurrentUser={isCurrentUserProfile}
                isFollowing={isFollowing}
                loadingFollow={loadingFollow}
                onFollowClick={handleFollow}
                onFollowersClick={handleOpenFollowers}
                onFollowingClick={handleOpenFollowing}
                onProfileUpdated={handleProfileUpdated}
            />

            <div className="mt-6">
              <ActivityFeed
                  activities={activities}
                  loading={loadingActivities}
                  currentUsername={currentUser?.username}
                  onDeleteActivity={handleDeleteActivity}
                  deletingId={deletingId}
              />
            </div>
          </div>

          <div
              id="livros"
              className="w-full lg:w-3/5 mt-6 lg:mt-0 overflow-auto"
              style={{ scrollMarginTop: 30 }}
          >
            <ViewProgressTable username={user.username} />
          </div>
        </div>

        {modalOpen && (
            <FollowModal
                activeTab={modalOpen}
                onCloseAction={handleCloseModal}
                followers={followers}
                following={following}
            />
        )}
      </main>
  );
}
