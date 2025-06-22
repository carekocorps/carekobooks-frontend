"use client";

import { ThreadReply } from "@/types/thread";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThreadReplyActions } from "../threads-replies/threads-replies-actions";

interface ReplyItemProps {
  reply: ThreadReply;
  threadId: number;
  depth: number;
  childrenReplies: ThreadReply[];
  hasChildren: boolean;
  isExpanded: boolean;
  onToggleChildren: () => void;
  onReplySuccess: (parentId?: number) => void;
}

export function ReplyItem({
  reply,
  threadId,
  depth,
  childrenReplies,
  hasChildren,
  isExpanded,
  onToggleChildren,
  onReplySuccess
}: ReplyItemProps) {
  const username = reply.user?.username || "Usuário desconhecido";
  const displayName = reply.user?.displayName || username;
  const content = reply.content || "Sem conteúdo";
  const createdAt = reply.createdAt ? new Date(reply.createdAt) : new Date();
  const marginLeft = depth * 24;

  return (
    <div className="mt-4">
      <div 
        className={`border-l-2 ${depth > 0 ? 'border-indigo-200' : 'border-transparent'} pl-4 py-2`}
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reply.user?.image?.url || "/default-avatar.png"} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h5 className="text-sm font-medium">{displayName}</h5>
            <p className="text-xs text-gray-500">
              {format(createdAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 whitespace-pre-line">{content}</p>
        
        <div className="mt-2 flex justify-between items-center">
          <div>
            {(hasChildren || reply.isContainingChildren) && !isExpanded && (
              <Button 
                variant="outline"
                size="sm"
                onClick={onToggleChildren}
                className="mt-2"
              >
                Carregar respostas
              </Button>
            )}
          </div>
          
          <ThreadReplyActions 
            threadId={threadId} 
            parentId={reply.id} 
            onSuccess={() => onReplySuccess(reply.id)} 
          />
        </div>
      </div>

      {isExpanded && childrenReplies.length > 0 && (
        <div className="mt-2 ml-6">
          {childrenReplies.map(childReply => (
            <ReplyItem 
              key={childReply.id}
              reply={childReply}
              threadId={threadId}
              depth={depth + 1}
              childrenReplies={[]} 
              hasChildren={childReply.isContainingChildren}
              isExpanded={false}
              onToggleChildren={() => {}} 
              onReplySuccess={onReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}