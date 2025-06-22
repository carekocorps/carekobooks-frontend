import Activity from "@/components/program/activity/activity";
import { BookActivity } from "@/types/activity";

interface ActivityFeedProps {
  activities: BookActivity[];
  loading: boolean;
}

export default function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-2xl p-6">
      <h1 className="text-white text-2xl font-bold mb-6 text-center">
        Mural de Atividades
      </h1>

      <div className="space-y-4 max-h-[500px] overflow-y-auto px-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full bg-white/80 dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 animate-pulse mx-auto">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="mx-auto">
              <Activity activity={activity} />
            </div>
          ))
        ) : (
          <div className="w-full bg-white/80 dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 text-center mx-auto">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma atividade recente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}