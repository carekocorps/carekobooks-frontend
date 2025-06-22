"use client";

import { GenreType } from "@/types/genre";
import UpdateGenreModal from "./update-genre-modal";
import DeleteGenreModal from "./delete-genre-modal";

interface GenreProps {
  genre: GenreType;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export default function GenreCard({
  genre,
  isAdmin = true,
  onDeleted,
}: GenreProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-3xl w-64 min-h-64 p-6
        shadow-xl dark:shadow-black/20
        hover:shadow-2xl dark:hover:shadow-black/40
        transition-shadow
        flex flex-col items-center justify-center gap-4
        border border-gray-200 dark:border-gray-700
      `}
    >
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {genre.displayName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {genre.description}
        </p>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <UpdateGenreModal name={genre.name} />
          <DeleteGenreModal genreName={genre.name} onDeleted={onDeleted} />
        </div>
      )}
    </div>
  );
}
