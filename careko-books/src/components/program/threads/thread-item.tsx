"use client";

import { Thread, ThreadReply } from "@/types/thread";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThreadReplyActions } from "../threads-replies/threads-replies-actions";
import { ReplyList } from "../threads-replies/reply-list";

interface ThreadItemProps {
  thread: Thread;
  threadState: {
    expanded: boolean;
    replies: ThreadReply[];
    childrenMap: Record<number, {
      replies: ThreadReply[];
      hasChildren: boolean;
    }>;
  };
  onToggleReplies: () => void;
  onReplySuccess: (parentId?: number) => void;
  onToggleChildReplies: (parentReplyId: number) => void;
}

export function ThreadItem({ 
  thread, 
  threadState,
  onToggleReplies,
  onReplySuccess,
  onToggleChildReplies
}: ThreadItemProps) {
  const username = thread.user?.username || "Usuário desconhecido";
  const displayName = thread.user?.displayName || username;
  const title = thread.title || "Sem título";
  const description = thread.description || "Sem descrição";
  const createdAt = thread.createdAt ? new Date(thread.createdAt) : new Date();
  const isExpanded = threadState.expanded;
  const replies = threadState.replies || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={thread.user?.image?.url || "/default-avatar.png"} />
            <AvatarFallback className="dark:bg-gray-600">
              {username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium dark:text-white">{displayName}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(createdAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={onToggleReplies}
            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            {isExpanded ? "Ocultar respostas" : "Carregar respostas"}
          </Button>
          
          <ThreadReplyActions 
            threadId={thread.id} 
            onSuccess={() => onReplySuccess()} 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
          <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-4">Respostas</h4>
          <div className="space-y-4">
            {replies.length > 0 ? (
              <ReplyList 
                threadId={thread.id}
                replies={replies}
                childrenMap={threadState.childrenMap}
                onToggleChildReplies={onToggleChildReplies}
                onReplySuccess={onReplySuccess}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma resposta ainda. Seja o primeiro a responder!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}