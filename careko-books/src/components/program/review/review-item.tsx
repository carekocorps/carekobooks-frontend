"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookReview } from "@/types/bookReview";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { ScoreCircle } from "../utils/score-circle";

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

          <ScoreCircle score={score}/>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
}