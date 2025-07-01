import { Thread } from "@/types/thread";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";


interface ThreadItemProps {
  thread: Thread;
}

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

export default function ThreadPreview({thread}: ThreadItemProps){
    const username = thread.user?.username || "Usuário Desconhecido";
    const displayName = thread.user?.username || username;
    const title = thread.title || "Sem título";
    const createdAt = thread.createdAt ? new Date(thread.createdAt) : new Date();

    return (
     <div className="w-full bg-white dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700">
        <div className="flex gap-4 items-center">
            <Avatar className="w-10 h-10">
            <AvatarImage
                src={thread.user.image?.url || "/default-avatar.png"}
                alt={`Avatar de ${thread.user.username}`}
                className="object-cover w-full h-full rounded-full"
            />
            </Avatar>
            <div className="text-gray-800 dark:text-gray-200 text-sm">
            <Link href={`../user/${thread.user.username}`} className="no-underline">
            <strong>@{thread.user.username}</strong></Link>
            <h1>{thread.title}</h1>
            </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
            {formatTime(thread.createdAt)}
        </p>
     </div>
    );
}