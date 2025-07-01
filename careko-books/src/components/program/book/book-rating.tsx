import { BarChart } from "lucide-react";
import { AverageCircle } from "../utils/average-cricle";


interface BookRatingProps {
  userAverageScore: number;
  reviewAverageScore: number;
}

export const BookRatingVisualization = ({ userAverageScore, reviewAverageScore }: BookRatingProps) => {

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-black/30 mt-4">
      <div className="flex items-center justify-center">
        <AverageCircle score={userAverageScore} target={100}/>
        <AverageCircle score={reviewAverageScore} target={100}/>
      </div>
    </div>
  );
};