import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-4">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <div className="flex justify-center gap-6 mt-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}