interface AverageProps {
  score: number;
  target: number;
  title?: string; 
}

export const AverageCircle = ({ score, target, title = "Média" }: AverageProps) => {
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0;
  const strokeLength = Math.min((safeScore / target) * 283, 283);
  const percentage = Math.min((safeScore / target) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {percentage.toFixed(1)}% de {target}%
        </p>
      </div>

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
              strokeDasharray={`${strokeLength} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-indigo-700 dark:text-indigo-300">
            {safeScore.toFixed(1)}
          </span>
          <span className="text-sm text-indigo-500 dark:text-indigo-400 mt-1">
            de {target} pontos
          </span>
        </div>
      </div>
    </div>
  );
};