import { useEffect, useState } from 'react'
import { BookType } from '@/types/book'
import { BookService } from '@/services/books.service'

export const useBooks = () => {
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await BookService.getBooks()
        setBooks(response.data.content)
      } catch (error) {
        console.error('Erro ao buscar livros:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return { books, loading }
}