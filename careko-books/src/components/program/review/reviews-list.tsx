"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviews } from "@/hooks/useReviews";
import { useEffect } from "react";
import { ReviewItem } from "./review-item";

interface ReviewListProps {
    bookId: number;
    refreshToken: number;
}

export function ReviewList({ bookId, refreshToken }: ReviewListProps) {
    const { reviews, loading, error, refresh } = useReviews(bookId);

    useEffect(() => {
        refresh();
    }, [refreshToken, refresh]);

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                            <div>
                                <Skeleton className="h-4 w-32 mb-2 bg-gray-200 dark:bg-gray-600" />
                                <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-600" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-3/4 mb-3 bg-gray-200 dark:bg-gray-600" />
                        <Skeleton className="h-16 w-full bg-gray-200 dark:bg-gray-600" />
                        <div className="mt-4">
                            <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-600" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                <h3 className="text-xl font-medium text-red-600 dark:text-red-400">Erro ao carregar resenhas</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Tentar novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
            ))}
        </div>
    );
}
