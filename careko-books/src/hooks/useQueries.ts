import { BookService } from '@/services/books.service';
import { BookType } from '@/types/book';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export const useQueries = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true) 
      try {
        const response = await BookService.getBooks()
        const allBooks = response.data.content;

        const filtered = searchQuery
          ? allBooks.filter((book: BookType) =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : allBooks

        setBooks(filtered)
      } catch (error) {
        console.error('Erro ao buscar livros:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [searchQuery])

  return { books, loading, searchQuery }
}