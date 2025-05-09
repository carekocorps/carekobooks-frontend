import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div
      className="flex flex-col items-center justify-start gap-2 w-40 
                 overflow-hidden rounded-xl border-3 border-white/20 
                 bg-white/10 backdrop-blur-md shadow-md"
    >
      <Skeleton className="w-40 h-60 rounded-t-md" />
      <div className="w-full px-2 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
