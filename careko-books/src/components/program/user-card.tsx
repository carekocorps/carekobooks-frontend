import { UserType } from "@/types/user";
import { Avatar, AvatarImage } from "../ui/avatar";
import { BsShieldLockFill } from "react-icons/bs";

interface UserProps {
    user: UserType;
}

export default function UserCard({ user }: UserProps) {
    return (
        <div className="bg-white rounded-3xl w-64 min-h-64 p-6 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center justify-center gap-4 border border-gray-200">
            <Avatar className="w-24 h-24 border-4 border-gray-300 shadow-sm">
                <AvatarImage
                    src={user.image?.url || "/default-avatar.png"}
                    alt="Imagem de avatar"
                    className="object-cover w-full h-full rounded-full"
                />
            </Avatar>

            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                        {user?.displayName || user.username}
                    </h2>
                    {user.role === "ADMIN" && (
                        <BsShieldLockFill className="text-blue-600 w-5 h-5" title="Admin" />
                    )}
                </div>

                <p className="text-sm text-gray-500">@{user.username}</p>
            </div>

            <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                Ver Perfil
            </button>
        </div>
    );
}
