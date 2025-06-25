"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookReview } from "@/types/bookReview";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface ReviewItemProps {
  review: BookReview;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const username = review.user.username;
  const displayName = review.user.displayName;
  const title = review.title || "Sem título";
  const description = review.content;
  const score = review.score;
  const createdAt = review.createdAt ? new Date(review.createdAt) : new Date();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.user?.image?.url || "/default-avatar.png"} />
              <AvatarFallback className="dark:bg-gray-600">
                {username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium dark:text-white">{displayName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(createdAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          
          {/* Score destacado */}
          <div className={`flex items-center justify-center rounded-full w-16 h-16 text-xl font-bold ${scoreColor}`}>
            {score}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
}