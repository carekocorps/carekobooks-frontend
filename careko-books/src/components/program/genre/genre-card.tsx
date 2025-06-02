import { GenreType } from "@/types/genre";
import UpdateGenreModal from "./update-genre-modal";
import DeleteGenreModal from "./delete-genre-modal";

interface GenreProps {
  genre: GenreType;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export default function GenreCard({ genre, isAdmin = true, onDeleted }: GenreProps) {
  return (
    <div className="bg-white rounded-3xl w-64 min-h-64 p-6 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center justify-center gap-4 border border-gray-200">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{genre.displayName}</h1>
        <h1 className="text-sm text-gray-500">{genre.description}</h1>
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