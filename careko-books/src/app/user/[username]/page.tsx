"use client";
import { useState } from "react";
import Activity from "@/components/program/activity";
import FollowModal from "@/components/program/follow-modal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockFollowers = [
    { name: "Park Jimin", username: "@parkjimin", avatar: "/usersMock/rose.png", isFollowing: true },
    { name: "Kim Taehyung", username: "@taehyung", avatar: "/usersMock/jennie.png", isFollowing: false },
    { name: "Kim Namjoon", username: "@namjoon", avatar: "/usersMock/sana.png", isFollowing: false },
];

const mockFollowing = [
    { name: "Min Yoongi", username: "@agustd", avatar: "/usersMock/ro.png", isFollowing: true },
    { name: "Park Jimin", username: "@parkjimin", avatar: "/usersMock/rose.png", isFollowing: true },
];

export default function ViewOtherUserProfile() {
    const [modalOpen, setModalOpen] = useState<"seguidores" | "seguindo" | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleOpen = (tab: "seguidores" | "seguindo") => {
        setModalOpen(tab);
    };

    const handleClose = () => {
        setModalOpen(null);
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <main>
            <div className="flex gap-12 mt-25">
                <div className="bg-white shadow-xl w-180 h-100 rounded-2xl relative overflow-visible flex flex-col justify-center items-start gap-5 pt-20">
                    <div className="absolute -top-10 left-[20%] transform -translate-x-1/2">
                        <Avatar className="w-40 h-40 border-6 border-white shadow-md">
                            <AvatarImage
                                src="/usersMock/jk.png"
                                alt="Imagem de avatar"
                                className="object-cover w-full h-full"
                            />
                        </Avatar>
                    </div>

                    <div className="flex flex-col m-15 gap-5">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-start text-center">
                                <h1 className="text-3xl">Jeon Jungkook</h1>
                                <h2>@jk</h2>
                            </div>

                            <div className="flex flex-col gap-2 px-4 min-w-[300px]">
                                <div className="flex justify-between w-full px-4">
                                    <button
                                        onClick={() => handleOpen("seguidores")}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {mockFollowers.length} seguidores
                                    </button>
                                    <button
                                        onClick={() => handleOpen("seguindo")}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {mockFollowing.length} seguindo
                                    </button>
                                    <h1 className="text-sm">10 livros</h1>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <Button
                                        className={`${isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        onClick={handleFollow}
                                    >
                                        {isFollowing ? 'Seguindo' : 'Seguir'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="w-150 h-30 bg-gray-200 rounded-2xl">
                            <p className="m-10">testando testando testando testando testando testando</p>
                        </div>
                    </div>

                    {modalOpen && (
                        <FollowModal
                            activeTab={modalOpen}
                            onClose={handleClose}
                            followers={mockFollowers}
                            following={mockFollowing}
                        />
                    )}
                </div>

                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 shadow-xl w-180 h-100 rounded-2xl
        flex flex-col justify-center items-center py-6 px-4">
                    <h1 className="text-white text-3xl mb-6 font-medium">
                        Mural de Atividades
                    </h1>
                    <div className="w-full max-w-[90%] space-y-4">
                    <Activity username="@parkjimin" livro="Mulherzinhas" horario="15:00" imagem="/usersMock/rose.png" acao="leu" />
                    <Activity username="@agustd" livro="Noites Brancas" horario="18:00" imagem="/usersMock/sana.png" acao="favoritou" />
                    </div>
                </div>
            </div>

            <h2 className="mt-10 text-lg font-medium">Seus Livros</h2>
        </main>
    );
}