import { ReviewService } from "@/services/bookReview.service";
import { BookReview } from "@/types/bookReview";
import { useCallback, useEffect, useState } from "react";

export function useReviews(bookId: number){
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);
            const reviewData = await ReviewService.searchReviews({
                bookId,
                pageSize: 20
            });

            setReviews(reviewData)
        } catch (err) {
            console.error("Erro ao Buscar Resenhas", err);
            setError("Não foi possível carregar as Resenhas");
        } finally {
            setLoading(false)
        }
    }, [bookId]);

    useEffect(() => {
        fetchReviews();
      }, [fetchReviews]);

    return {
        reviews,
        loading,
        error,
        refresh: fetchReviews 
    }
}