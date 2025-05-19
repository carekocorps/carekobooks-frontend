import { BookType } from "@/types/book";
import Image from "next/image";


  export default function Book(bookProps: {bookItem: BookType}) {
    const { bookItem } = bookProps
    return (
      <div
        className="flex flex-col items-center justify-start gap-2 w-40 
                   overflow-hidden rounded-xl border-3 border-white/20 
                   bg-white/10 backdrop-blur-md shadow-md 
                   transition-transform duration-300 hover:scale-105"
      >
        <div className="relative w-40 h-60 shadow-md">
          <Image
            src={bookItem.image.url}
            alt="Capa de Livro"
            fill
            className="object-cover rounded-t-md"
          />
        </div>
  
        <h2 className="w-full h-10 text-sm text-center line-clamp-2">
          {bookItem.title}
        </h2>
      </div>
    );
  }