interface ScoreProps{
    score: number;
}
export function ScoreCircle({score}: ScoreProps){
    const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const scoreColor = getScoreColor(score);

  return(
    <div className={`flex items-center justify-center rounded-full w-16 h-16 text-xl border-2 shadow-4xl border-amber-50 ${scoreColor}`}>
        <div className="flex flex-col items-center">
            <p className="text-xs">Nota:</p>
            <p className="text-sm font-bold">{score}</p>
        </div>
    </div>
  )
}