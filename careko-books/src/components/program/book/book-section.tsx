import { BookType } from "@/types/book";
import CarouselBooks from "@/components/program/book/books-carousel";
import { Separator } from "@/components/ui/separator";
import Book from "@/components/program/book/book";
import { SkeletonCard } from "../skeleton-card";

type Props = {
  title: string;
  iconClass: string;
  books: BookType[];
  loading: boolean;
};

export default function BookSection({ title, iconClass, books, loading }: Props) {
  return (
    <div className="w-218">
      <h1 className="text-2xl text-[#2E2E2E] flex items-center gap-4">
        <i className={iconClass}></i>
        {title}
      </h1>
      <Separator orientation="horizontal" className="h-px bg-gray-300" />
      {loading ? (
        <CarouselBooks
            books={[...Array(3)].map((_, index) => (
        <SkeletonCard key={index} />
        ))}
         />
      ) : books.length === 0 ? (
        <CarouselBooks
            books={[...Array(3)].map((_, index) => (
        <SkeletonCard key={index} />
        ))}
         />
      ) : (
        <ul className="gap-1">
          <CarouselBooks
            books={books.map((book) => (
              <Book key={book.id} bookItem={book} />
            ))}
          />
        </ul>
      )}
    </div>
  );
}
