import { BarChart } from "lucide-react";
import { AverageCircle } from "../utils/average-circle";

interface BookRatingProps {
  userAverageScore: number;
  reviewAverageScore: number;
}

export const BookRatingVisualization = ({ userAverageScore, reviewAverageScore }: BookRatingProps) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-black/30 mt-4">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">
            Comparativo de Avaliações
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Sua avaliação comparada com a média geral
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <AverageCircle 
            score={userAverageScore} 
            target={100}
            title="Avaliações de Usuários" 
          />
        </div>

        <div className="flex flex-col items-center">
          <AverageCircle 
            score={reviewAverageScore} 
            target={100}
            title="Avaliações de Resenhas" 
          />
        </div>
      </div>
    </div>
  );
};