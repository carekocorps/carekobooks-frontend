"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface DropdownProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function Dropdown({ children, onLogout }: DropdownProps) {
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="
        w-56 p-2 text-base mr-20
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-gray-200
        border border-gray-200 dark:border-gray-700
        shadow-md dark:shadow-black/20
      ">
        <DropdownMenuLabel className="text-sm">Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 border-gray-200 dark:border-gray-700" />

        <Link href={`/user/${user?.username}`}>
          <DropdownMenuItem className="
            flex items-center gap-2
            px-2 py-1 rounded-md
            hover:bg-zinc-100 dark:hover:bg-zinc-700
            cursor-pointer
          ">
            <i className="bi bi-person-fill text-lg text-zinc-600 dark:text-zinc-300" />
            Meu Perfil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="my-2 border-gray-200 dark:border-gray-700" />

        <DropdownMenuItem asChild className="px-2 py-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between gap-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 px-2 py-1"
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
            </div>
            <span
              className={`
                relative inline-block w-10 h-6
                bg-gray-300 dark:bg-gray-600
                rounded-full transition-colors
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5
                  w-5 h-5 bg-white dark:bg-gray-300
                  rounded-full shadow
                  transform transition-transform
                  ${isDark ? "translate-x-4" : "translate-x-0"}
                `}
              />
            </span>
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 border-gray-200 dark:border-gray-700" />

        <DropdownMenuItem
          className="
            flex items-center gap-2
            px-2 py-1 rounded-md
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900
            cursor-pointer
          "
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right text-lg" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
