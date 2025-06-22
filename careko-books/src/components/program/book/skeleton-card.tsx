import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div
      className={`
        flex flex-col items-center justify-start gap-2 w-40 
        overflow-hidden rounded-xl border-3 
        border-white/20 dark:border-gray-700
        bg-white/10 dark:bg-gray-800/30
        backdrop-blur-md shadow-md dark:shadow-black/30
        transition-colors
      `}
    >
      <Skeleton className="w-40 h-60 rounded-t-md bg-gray-200 dark:bg-gray-700" />
      <div className="w-full px-2 space-y-1">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
