import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user";
import UpdateUserModal from "./edit-profile-modal";

interface ProfileHeaderProps {
  user: UserType;
  isCurrentUser: boolean;
  isFollowing: boolean;
  loadingFollow: boolean;
  onFollowClick: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  onProfileUpdated?: () => void; 
}

export default function ProfileHeader({
  user,
  isCurrentUser,
  isFollowing,
  loadingFollow,
  onFollowClick,
  onFollowersClick,
  onFollowingClick,
  onProfileUpdated, 
}: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg w-full lg:w-[30rem] h-[28rem] rounded-2xl relative overflow-visible flex flex-col items-center gap-5 pt-24 pb-8 px-6 border border-gray-100 dark:border-gray-800 mx-auto">
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
              onClick={onFollowersClick}
              className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="font-bold text-gray-900 dark:text-white">{user.followersCount}</span>
              <span>Seguidores</span>
            </button>
            <button
              onClick={onFollowingClick}
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

          {!isCurrentUser && (
            <div className="w-full max-w-xs">
              <Button
                className={`w-full ${isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={onFollowClick}
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

          {isCurrentUser && (
            <div className="flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
              <UpdateUserModal 
                username={user.username}
                onSuccess={onProfileUpdated}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Editar Perfil
                </Button>
              </UpdateUserModal>
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
  );
}