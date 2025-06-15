import { notFound } from "next/navigation";
import { Star, Pen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookService } from "@/services/books.service";
import { ProgressActions } from "@/components/program/progresses/progresses-actions";


interface BookDetailPageProps {
  params: { id: number };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
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
    <main className="min-h-screen px-4 py-10 md:px-8 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="flex justify-center lg:justify-start">
          <Image
            src={bookData.image.url || "/placeholder.png"}
            alt={bookData.title}
            width={260}
            height={380}
            className="rounded-2xl border border-gray-200 shadow-xl object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-between gap-8 min-w-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 break-words">
                {bookData.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-2 font-serif break-words">
                {bookData.authorName}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-medium shadow-sm">
                {bookData.pageCount} páginas
              </span>
              <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-medium shadow-sm">
                Publicado em {new Date(bookData.publishedAt).getFullYear()}
              </span>
              <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full font-medium shadow-sm">
                Editora: {bookData.publisherName}
              </span>
            </div>

            <p className="text-gray-800 text-justify leading-relaxed text-[1.05rem] break-words">
              {bookData.synopsis}
            </p>
          </div>

          <ProgressActions bookId={bookData.id} /> 
        </div>

        <aside className="lg:col-span-2 bg-slate-100 p-6 sm:p-8 rounded-2xl shadow-inner text-center mt-4">
          <h3 className="text-4xl font-bold text-indigo-700">4.7</h3>
          <div className="flex justify-center gap-1 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-5">Média com base em 737 avaliações</p>
          <Button
            variant="outline"
            className="w-full sm:w-64 mx-auto flex gap-2 items-center justify-center rounded-lg hover:scale-105 transition-all"
          >
            <Pen className="w-4 h-4" />
            Avaliar este livro
          </Button>
        </aside>
      </div>
    </main>
  );
}
