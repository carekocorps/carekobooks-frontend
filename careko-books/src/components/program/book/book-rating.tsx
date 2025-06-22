import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Star, Info, BarChart, PieChart } from "lucide-react";

interface BookRatingProps {
  userAverageScore: number;
  reviewCount: number;
}

export const BookRatingVisualization = ({ userAverageScore, reviewCount }: BookRatingProps) => {
  const userScore = userAverageScore / 10;
  const starRating = Math.round(userScore * 2) / 2; 
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-black/30 mt-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e0e7ff"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${userScore * 28.27} 283`} 
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-indigo-700 dark:text-indigo-300">
                {userScore.toFixed(1)}
              </span>
              <span className="text-sm text-indigo-500 dark:text-indigo-400 mt-1">
                de 10 pontos
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm dark:shadow-black/10">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Como calculamos a nota?
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mt-1">
                  <BarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Coleta de avaliações
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    As avaliações são feitas em uma escala de 0 a 100, mas exibimos em uma 
              escala de 0 a 10 para melhor compreensão. Cada ponto na nota final 
              representa 10 pontos nas avaliações originais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};