import { notFound } from "next/navigation";
import Image from "next/image";
import { BookService } from "@/services/books.service";
import { ProgressActions } from "@/components/program/progresses/progresses-actions";
import { ReviewActions } from "@/components/program/review/reviews-actions";
import { ThreadActions } from "@/components/program/threads/threads-actions";
import { ThreadList } from "@/components/program/threads/threads-list";
import { BookRatingVisualization } from "@/components/program/book/book-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";
import { MessageSquare, PenSquare } from "lucide-react";
import { ReviewList } from "@/components/program/review/reviews-list";
import { GenreType } from "@/types/genre";
import FavoriteButton from "@/components/program/progresses/favorite-button";


export default async function BookDetailPage({ params }: any) {
  const bookId = Number(params.id);
  if (isNaN(bookId)) return notFound();

  let bookData;
  try {
    const response = await BookService.getBookById(bookId);
    bookData = response.data;
  } catch {
    return notFound();
  }

  return (
    <main className="min-h-screen px-4 py-10 md:px-8 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-black/30 p-6 md:p-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="flex justify-center lg:justify-start">
          <Image
            src={bookData.image.url || "/placeholder.png"}
            alt={bookData.title}
            width={260}
            height={380}
            unoptimized
            className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-black/20 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-between gap-8 min-w-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 break-words">
                {bookData.title}
              </h1>
              <p className="text-lg md:text-xl font-serif mt-2 text-gray-600 dark:text-gray-300 break-words">
                {bookData.authorName}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-1 rounded-full font-medium shadow-sm">
                {bookData.pageCount} páginas
              </span>
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-4 py-1 rounded-full font-medium shadow-sm">
                Publicado em {new Date(bookData.publishedAt).getFullYear()}
              </span>
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-4 py-1 rounded-full font-medium shadow-sm">
                Editora: {bookData.publisherName}
              </span>
               {bookData.genres && bookData.genres.length > 0 && (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-4 py-1 rounded-full font-medium shadow-sm">
                    Gêneros: {bookData.genres.map((genre: GenreType) => genre.displayName).join(', ')}
                  </span>
                )}
            </div>

            <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed text-[1.05rem] break-words">
              {bookData.synopsis}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center">
            <div>
              <ProgressActions bookId={bookData.id} />
            </div>
            <div>
              <ReviewActions bookId={bookData.id} />
            </div>
            <FavoriteButton 
              bookId={bookData.id} 
              initialIsFavorite={false} 
            />
          </div>
        </div>

        <aside className="lg:col-span-2">
          <BookRatingVisualization 
            userAverageScore ={bookData.userAverageScore} 
            reviewAverageScore={bookData.reviewAverageScore}
          />
        </aside>

        <div className="lg:col-span-2 mt-12">
          <Tabs defaultValue="discussions" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <TabsTrigger 
                  value="discussions" 
                  className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    Discussões
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-2">
                    <PenSquare size={18} />
                    Resenhas
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-3">
                <ThreadActions bookId={bookData.id} />
              </div>
            </div>

            <TabsContent value="discussions">
              <Card className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg dark:shadow-black/20 p-6 space-y-6">
                <ThreadList bookId={bookData.id} />
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg dark:shadow-black/20 p-6">
                <ReviewList bookId={bookData.id} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
