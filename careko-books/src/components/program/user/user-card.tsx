import { UserType } from "@/types/user";

import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

interface UserProps {
  user: UserType;
}

export default function UserCard({ user }: UserProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl w-52 min-h-64 p-6 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center justify-center gap-4 border border-gray-200 dark:border-gray-700">
      <Avatar className="w-20 h-20  border-gray-300 dark:border-gray-600 shadow-sm">
        <AvatarImage
          src={user.image?.url || "/default-avatar.png"}
          alt="Imagem de avatar"
          className="object-cover w-full h-full rounded-full"
        />
      </Avatar>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {user.displayName || user.username}
          </h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
      </div>

      <Link href={`user/${user.username}`} className="no-underline">
        <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
          Ver Perfil
        </button>
      </Link>
    </div>
  );
}