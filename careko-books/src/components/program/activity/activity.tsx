import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BookActivity } from "@/types/activity";
import Link from "next/link";

type ActivityProps = {
  activity: BookActivity;
};

export default function Activity({ activity }: ActivityProps) {
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

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700">
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
           <strong>@{activity.user.username}</strong></Link> {getAction()}{" "}
          <span className="text-blue-600 dark:text-blue-400">
           <Link href={`../books/${activity.book.id}`} className="no-underline"> {activity.book.title} </Link>
          </span>
        </p>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-xs">
        {formatTime(activity.createdAt)}
      </p>
    </div>
  );
}