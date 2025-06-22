'use client';

import { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UserType } from "@/types/user";
import Link from "next/link";


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

  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  const users = tab === "seguidores" ? followers : following;
  const title = tab === "seguidores" ? "Seguidores" : "Seguindo";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="follow-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">

        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2
            id="follow-modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {title} ({users.length})
          </h2>
          <button
            onClick={onCloseAction}
            aria-label="Fechar modal"
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex">
          {["seguidores", "seguindo"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`
                flex-1 py-3 text-center font-medium
                ${tab === t
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}
              `}
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
              {users.map((user) => (
                <li key={user.username} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  <Link href={`user/${user.username}`} className="no-underline">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={user.image?.url || "/default-avatar.png"}
                        alt={`Avatar de ${user.username}`}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
