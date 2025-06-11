"use client";


import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


interface User {
    name: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
}


interface ModalProps {
    activeTab: "seguidores" | "seguindo";
    onCloseAction: () => void;
    followers: User[];
    following: User[];
}


export default function FollowModal({ activeTab, onCloseAction, followers, following }: ModalProps) {
    const [tab, setTab] = useState<"seguidores" | "seguindo">(activeTab);


    const users = tab === "seguidores" ? followers : following;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[500px] max-w-full rounded-xl shadow-lg relative p-6">
                <button onClick={onCloseAction} className="absolute top-3 right-3 text-gray-600 hover:text-black">
                    <X size={20} />
                </button>


                <div className="flex justify-center gap-4 mb-6 text-lg font-medium">
                    <button
                        onClick={() => setTab("seguidores")}
                        className={tab === "seguidores" ? "text-blue-600 underline" : "text-gray-500"}
                    >
                        seguidores
                    </button>
                    <span>|</span>
                    <button
                        onClick={() => setTab("seguindo")}
                        className={tab === "seguindo" ? "text-blue-600 underline" : "text-gray-500"}
                    >
                        seguindo
                    </button>
                </div>


                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
                    {users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={user.avatar} />
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-sm text-gray-500">{user.username}</span>
                                </div>
                            </div>
                            {user.isFollowing ? (
                                <Button variant="secondary" className="text-sm cursor-default">Seguindo</Button>
                            ) : (
                                <Button className="text-sm">Seguir</Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
