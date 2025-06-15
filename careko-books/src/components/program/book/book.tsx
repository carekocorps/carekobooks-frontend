
import Image from "next/image";
import { BookType } from "@/types/book";
import UpdateBookModal from "./update-book-modal";
import DeleteBookModal from "./delete-book-modal";
import Link from "next/link";

interface BookProps {
  bookItem: BookType;
  isAdmin?: boolean;
  onDeleted?: () => void; 
}

export default function Book({ bookItem, isAdmin = false, onDeleted }: BookProps) {
  return (
    <Link href={`books/${bookItem.id}`} className="no-underline">
    <div
      className="flex flex-col items-center justify-start gap-1 w-40
                 overflow-hidden rounded-xl border-6 border-white/30
                 bg-white/10 backdrop-blur-md shadow-md
                 transition-transform duration-300 hover:scale-105"
    >
      <div className="relative w-40 h-50 shadow-md">
        <Image
          src={bookItem.image.url}
          alt={`Capa do livro ${bookItem.title}`}
          fill
          className="object-cover rounded-t-md"
        />
      </div>

      <h2 className="w-full h-10 text-sm text-center line-clamp-2 mb-1">
        {bookItem.title}
      </h2>

      {isAdmin && (
        <div className="flex gap-2 justify-center items-center">
          <UpdateBookModal id={bookItem.id}/>
          <DeleteBookModal bookId={bookItem.id} onDeleted={onDeleted} />
        </div>
      )}
    </div>
  </Link>
  );
}