'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { UserType } from "@/types/user";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserSocialService } from "@/services/userSocial.service";
import { Button } from "@/components/ui/button";

interface ModalProps {
    activeTab: "seguidores" | "seguindo";
    onCloseAction: () => void;
    followers: UserType[];
    following: UserType[];
}

export default function FollowModal({
                                        activeTab,
                                        onCloseAction,
                                        followers,
                                        following,
                                    }: ModalProps) {
    const [tab, setTab] = useState<"seguidores" | "seguindo">(activeTab);
    const [followingList, setFollowingList] = useState<string[]>([]);
    const [loadingMap, setLoadingMap] = useState<{ [username: string]: boolean }>({});

    const currentUser = useCurrentUser().user;
    const users = tab === "seguidores" ? followers : following;
    const title = tab === "seguidores" ? "Seguidores" : "Seguindo";

    useEffect(() => {
        setTab(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const fetchFollowing = async () => {
            if (!currentUser) return;
            try {
                const response = await UserSocialService.getFollowing(currentUser.username, { pageSize: 100 });
                const usernames = response.data.content.map((u: UserType) => u.username);
                setFollowingList(usernames);
            } catch (error) {
                console.error("Erro ao carregar seguidos:", error);
            }
        };

        fetchFollowing();
    }, [currentUser]);

    const handleFollowToggle = async (targetUsername: string) => {
        if (!currentUser || targetUsername === currentUser.username) return;

        setLoadingMap(prev => ({ ...prev, [targetUsername]: true }));

        try {
            const isAlreadyFollowing = followingList.includes(targetUsername);

            if (isAlreadyFollowing) {
                await UserSocialService.unfollowUser(currentUser.username, targetUsername);
                setFollowingList(prev => prev.filter(username => username !== targetUsername));
            } else {
                await UserSocialService.followUser(currentUser.username, targetUsername);
                setFollowingList(prev => [...prev, targetUsername]);
            }
        } catch (error) {
            console.error("Erro ao seguir/desseguir:", error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [targetUsername]: false }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title} ({users.length})
                    </h2>
                    <button
                        onClick={onCloseAction}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex">
                    {(["seguidores", "seguindo"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3 text-center font-medium ${
                                tab === t
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                        >
                            {t === "seguidores" ? "Seguidores" : "Seguindo"}
                        </button>
                    ))}
                </div>


                <div className="max-h-[400px] overflow-y-auto">
                    {users.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            Nenhum {title.toLowerCase()} ainda.
                        </div>
                    ) : (
                        <ul className="divide-y dark:divide-gray-700">
                            {users.map((user) => {
                                const isMe = currentUser?.username === user.username;
                                const isFollowing = followingList.includes(user.username);
                                const loading = loadingMap[user.username];

                                return (
                                    <li
                                        key={user.username}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                                    >
                                        <Link href={`/user/${user.username}`} className="flex items-center gap-4 no-underline">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage
                                                    src={user.image?.url || "/default-avatar.png"}
                                                    alt={`Avatar de ${user.username}`}
                                                />
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {user.displayName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </Link>

                                        {!isMe && (
                                            <Button
                                                size="sm"
                                                className={`ml-4 ${isFollowing
                                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                                disabled={loading}
                                                onClick={() => handleFollowToggle(user.username)}
                                            >
                                                {loading
                                                    ? "..."
                                                    : isFollowing
                                                        ? "Seguindo"
                                                        : "Seguir"}
                                            </Button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
