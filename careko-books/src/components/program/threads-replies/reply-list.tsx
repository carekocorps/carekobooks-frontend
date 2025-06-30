"use client";

import { ThreadReply } from "@/types/thread";
import { ReplyItem } from "./reply-item";

interface ReplyListProps {
  threadId: number;
  replies: ThreadReply[];
  childrenMap: Record<number, {
    replies: ThreadReply[];
    hasChildren: boolean;
  }>;
  onToggleChildReplies: (parentReplyId: number) => void;
  onReplySuccess: (parentId?: number) => void;
}

export function ReplyList({ 
  threadId, 
  replies,
  childrenMap,
  onToggleChildReplies,
  onReplySuccess
}: ReplyListProps) {
  return (
    <>
      {replies.map(reply => {
        const childState = childrenMap[reply.id];
        const childrenReplies = childState?.replies || [];
        const hasChildren = childState?.hasChildren || false;
        const isExpanded = childrenReplies.length > 0;

        return (
          <ReplyItem
            key={`reply-${reply.id}`}
            reply={reply}
            threadId={threadId}
            depth={0}
            childrenReplies={childrenReplies}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggleChildren={() => onToggleChildReplies(reply.id)}
            onReplySuccess={onReplySuccess}
          />
        );
      })}
    </>
  );
}