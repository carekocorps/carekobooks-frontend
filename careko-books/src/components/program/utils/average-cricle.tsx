interface AverageProps {
  score: number;
  target: number;
}

export const AverageCircle = ({ score, target }: AverageProps) => {
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0;
  const strokeLength = Math.min((safeScore / target) * 283, 283); 

  return (
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
    </div>
  );
};
