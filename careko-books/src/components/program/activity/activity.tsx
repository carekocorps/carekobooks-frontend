import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BookActivity } from "@/types/activity";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ActivityService } from "@/services/activity.service";
import { toast } from "sonner";
import DeleteActivityModal from "./delete-activity-modal";

type ActivityProps = {
  activity: BookActivity;
  isCurrentUser?: boolean;
  onDelete?: (id: number) => Promise<void>;
  isDeleting?: boolean;
};

export default function Activity({ 
  activity, 
  isCurrentUser = false,
  onDelete,
  isDeleting = false
}: ActivityProps) {
  const getAction = () => {
    switch (activity.status) {
      case "FINISHED":
        return "leu";
      case "PLANS_TO_READ":
        return "planeja ler";
      case "READING":
        return "está lendo";
      default:
        return "interagiu com";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return isToday 
      ? `hoje, às ${hours}:${minutes}`
      : `${date.toLocaleDateString()}, às ${hours}:${minutes}`;
  };

  const handleDelete = async () => {
    try {
      await ActivityService.deleteActivity(activity.id);
      toast.success("Atividade removida com sucesso");
      onDelete?.(activity.id);
    } catch (error) {
      toast.error("Erro ao remover atividade");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700 relative">
      {isCurrentUser && !isDeleting && (
        <div className="absolute top-3 right-3">
          <DeleteActivityModal 
            activityId={activity.id}
            onDeleted={async () => onDelete && await onDelete(activity.id)}
          />
        </div>
      )}
      
      {isDeleting && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      
      <div className="flex gap-4 items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={activity.user.image?.url || "/default-avatar.png"}
            alt={`Avatar de ${activity.user.username}`}
            className="object-cover w-full h-full rounded-full"
          />
        </Avatar>
        <p className="text-gray-800 dark:text-gray-200 text-sm">
          <Link href={`../user/${activity.user.username}`} className="no-underline">
            <strong>@{activity.user.username}</strong>
          </Link> {getAction()}{" "}
          <span className="text-blue-600 dark:text-blue-400">
            <Link href={`../books/${activity.book.id}`} className="no-underline">
              {activity.book.title}
            </Link>
          </span>
        </p>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-xs">
        {formatTime(activity.createdAt)}
      </p>
    </div>
  );
}