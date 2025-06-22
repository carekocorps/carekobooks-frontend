"use client";

export function SkeletonGenreCard() {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-3xl w-64 min-h-64 p-6
        shadow-xl dark:shadow-black/20
        hover:shadow-2xl dark:hover:shadow-black/40
        transition-shadow
        flex flex-col items-center justify-center gap-4
        border border-gray-200 dark:border-gray-700
        animate-pulse
      `}
    >
      <div className="text-center space-y-2 w-full">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto" />
      </div>

      <div className="flex gap-2 mt-4 w-full justify-center">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
