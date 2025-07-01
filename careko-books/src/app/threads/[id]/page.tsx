import { ThreadActions } from "@/components/program/threads/threads-actions";
import { ThreadList } from "@/components/program/threads/threads-list";
import { Card } from "@/components/ui/card";
import { BookService } from "@/services/books.service";
import { notFound } from "next/navigation";

export default async function ThreadsPage({ params }: any){
    const bookId = Number(params.id);
    if(isNaN(bookId)) return notFound();

    let bookData;
    try{
        const response = await BookService.getBookById(bookId);
        bookData = response.data;
    } catch {
        return notFound();
    }

    return(
        <main className="min-h-screen px-4 py-10 md:px-8 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800 gap-4">
             <div className="flex gap-3">
                <ThreadActions bookId={bookId} />
            </div>

            <Card className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg dark:shadow-black/20 p-6 space-y-6">
                <ThreadList bookId={bookId} />
            </Card>
        </main>
    )

}